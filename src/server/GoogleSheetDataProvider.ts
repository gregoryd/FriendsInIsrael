
import { DataProvider, EntityDataProvider, EntityDataProviderFindOptions, EntityMetadata, Filter, getValueList, InMemoryDataProvider } from "remult";
import { v4 } from 'uuid';
import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet, ServiceAccountCredentials } from "google-spreadsheet";


export interface GoogleSheetsDataProviderOptions {
    optimisticUpdates: boolean,
    secondsToCacheQueries: number,
    sheetId: string
}
export class GoogleSheetsDataProvider implements DataProvider {
    constructor(private clientSecretJson: ServiceAccountCredentials, private options: GoogleSheetsDataProviderOptions) {
        console.log({ sheetId: options.sheetId });
    }
    getEntityDataProvider(entity: EntityMetadata<any>): EntityDataProvider {
        let r = this.cache.get(entity.key);
        if (r) {
            if (!this.options.secondsToCacheQueries)
                r = undefined;
            else {
                const age = (new Date().getTime() - r.loadTime.getTime()) / 1000;
                console.log("Age:", age, this.options.secondsToCacheQueries);
                if (age > this.options!.secondsToCacheQueries) {
                    console.log("Clear cache");
                    r = undefined;
                }
            }
        }
        if (!r)
            this.cache.set(entity.key, r = new GoogleSheetsEntityDataProvider(entity, () => this.getDoc(), Boolean(this.options?.optimisticUpdates)));
        return r;


    }
    cache = new Map<string, GoogleSheetsEntityDataProvider>();
    doc?: GoogleSpreadsheet;
    async getDoc() {
        if (this.doc)
            return this.doc;
        let doc = new GoogleSpreadsheet(this.options.sheetId);
        await doc.useServiceAccountAuth(this.clientSecretJson);
        await doc.loadInfo();
        return this.doc = doc;

    }
    transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void> {
        return action(this);
    }
    supportsCustomFilter?: boolean | undefined;

}

class GoogleSheetsEntityDataProvider implements EntityDataProvider {
    loadTime = new Date();
    constructor(private entity: EntityMetadata<any>, private getDoc: () => Promise<GoogleSpreadsheet>, private optimisticUpdates: boolean) {

    }
    async count(where: Filter): Promise<number> {
        return (await (await this.find({ where })).length);
    }
    last?: {
        dp: EntityDataProvider;
        rows: GoogleSpreadsheetRow[];
        sheet: GoogleSpreadsheetWorksheet;
    }
    async init() {
        if (this.last)
            return this.last;
        const doc = await this.getDoc();
        const sheet = doc.sheetsByTitle[await this.entity.getDbName()];
        let rows = await sheet.getRows();
        let updateHeaderAndReload = false;
        for (const f of this.entity.fields.toArray()) {
            var dbName = await f.getDbName();
            if (!sheet.headerValues.includes(dbName)) {
                sheet.headerValues.push(dbName);
                updateHeaderAndReload = true;
            }
        }
        if (updateHeaderAndReload) {
            await sheet.setHeaderRow(sheet.headerValues);
            rows = await sheet.getRows();
        }
        console.log("Loaded rows");
        const memRows = [];

        for (const r of rows) {
            if (!r.id) {
                console.log(r.id);
                r.id = v4();
                await r.save();
            }
            memRows.push(await this.toJson(r));
        }

        const mem = new InMemoryDataProvider();
        mem.rows[this.entity.key] = memRows;
        const dp = mem.getEntityDataProvider(this.entity);
        return this.last = {
            dp,
            rows,
            sheet
        };

    }
    async find(options?: EntityDataProviderFindOptions): Promise<any[]> {
        return (await this.init()).dp.find(options);
    }


    async toJson(r: any) {
        let item: any = {};
        for (const col of this.entity.fields.toArray()) {
            item[col.key] = r[await col.getDbName()];
            if (col.valueType === typeof (Boolean)) {
                item[col.key] = item[col.key] == "TRUE";
            }
        }
        return item;
    }
    async update(id: any, data: any): Promise<any> {
        const { rows, dp } = await this.init();
        const row = rows.find(x => x.id === id)!;
        await this.fromJson(data, row);
        const updatePromise = row.save();
        if (!this.optimisticUpdates)
            await updatePromise;
        return dp.update(id, data);
    }
    private async fromJson(data: any, theData: any) {
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




    async delete(id: any): Promise<void> {
        const { rows, dp } = await this.init();
        const row = rows.find(x => x.id === id)!;
        const updatePromise = row.delete();
        if (!this.optimisticUpdates)
            await updatePromise;
        return await dp.delete(id);

    }
    async insert(data: any): Promise<any> {
        const { sheet, dp, rows } = await this.init();
        const theData = await this.fromJson(data, {});
        const updatePromise = await sheet.addRow(theData).then(newRow => rows.push(newRow));
        if (!this.optimisticUpdates)
            await updatePromise;
        return await dp.insert(data);
    }

}