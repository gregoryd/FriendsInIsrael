import axios from "axios";
import { DataProvider, EntityDataProvider, EntityDataProviderFindOptions, EntityMetadata, Filter, getValueList, InMemoryDataProvider } from "remult";
import { v4 } from 'uuid';
import { config } from 'dotenv';
config();

const sheetsUrl = process.env.SheetDB_API;
console.log({ sheetsUrl });
export class GoogleSheetsDataProvider implements DataProvider {
    getEntityDataProvider(entity: EntityMetadata<any>): EntityDataProvider {
        return new GoogleSheetsEntityDataProvider(entity);
    }
    transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void> {
        return action(this);
    }
    supportsCustomFilter?: boolean | undefined;

}

class GoogleSheetsEntityDataProvider implements EntityDataProvider {
    constructor(private entity: EntityMetadata<any>) {

    }
    async count(where: Filter): Promise<number> {
        return (await (await this.find({ where })).length);
    }
    async sheet() {
        return '?sheet=' + encodeURIComponent(await this.entity.getDbName())
    }
    mem?: InMemoryDataProvider;
    async find(options?: EntityDataProviderFindOptions): Promise<any[]> {
        if (options?.where) {
            let w = options.where.toJson();
            if (typeof w.id == "string") {
                return [await this.getRowById(w.id)];
            }
        }
        return (await this.loadMem()).getEntityDataProvider(this.entity).find(options);
    }
    private async loadMem() {
        if (this.mem)
            return this.mem;
        const path = sheetsUrl + await this.sheet();
        //console.time("get from google " + path);
        const res: any = await axios.get(path);
        //console.timeEnd("get from google " + path);
        const rows = [];
        for (const r of res.data) {
            rows.push(await this.toJson(r));
        }
        const mem = new InMemoryDataProvider();
        mem.rows[this.entity.key] = rows;
        this.mem = mem;
        return mem;
    }

    async toJson(r: any) {
        let item: any = {};
        if (!r.id) {
            for (const key of Object.keys(r)) {
                if (key != 'id' && r[key]) {
                    r.id = v4();
                    const path = sheetsUrl + '/batch_update' + await this.sheet();
                    await axios.put(path, {
                        data: [{ query: key + "=" + r[key], id: r.id }]
                    });
                    break;
                }
            }

        }
        for (const col of this.entity.fields.toArray()) {
            item[col.key] = r[await col.getDbName()];
            if (col.valueType === typeof (Boolean)) {
                item[col.key] = item[col.key] == "TRUE";
            }
        }
        return item;
    }
    async update(id: any, data: any): Promise<any> {
        let theData: any = await this.fromJson(data);
        try {
            if (false)
                console.log("update", {
                    key: this.entity.key,
                    id,
                    theData
                })
            await axios.put(await this.idPath(id), theData);
            this.mem = undefined;
        } catch (err: any) {
            console.error("update " + await this.idPath(id), {

                message: err.message,
                errorData: err.response?.data,
                dataThatWasSent: theData
            });
            throw err;
        }
        return await this.getRowById(id);
    }
    private async fromJson(data: any) {
        let theData: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                let element = data[key];
                const f = this.entity.fields.find(key);
                element = f.valueConverter.toJson!(element);
                if (f.valueType === Boolean)
                    element = element ? 'TRUE' : 'FALSE';
                theData[await f.getDbName()] = element;
            }
        }
        return theData;
    }

    private async getRowById(id: any) {
        const path = sheetsUrl + '/search' + await this.sheet() + '&id=' + id;
        var mem = new InMemoryDataProvider();
        mem.rows[this.entity.key] = [await this.toJson((await axios.get(path)).data[0])];
        let rows = await mem.getEntityDataProvider(this.entity).find();
        return (rows)[0];
    }

    private async idPath(id: any): Promise<string> {
        return sheetsUrl + '/id/' + id + await this.sheet();
    }

    async delete(id: any): Promise<void> {

        await axios.delete(await this.idPath(id));
        this.mem = undefined;
    }
    async insert(data: any): Promise<any> {
        const id = data.id;
        let theData: any = await this.fromJson(data);
        await axios.post(sheetsUrl + await this.sheet(), theData);
        this.mem = undefined;
        return await this.getRowById(id);
    }

}