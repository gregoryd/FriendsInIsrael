import { Allow, BackendMethod, Entity, Field, Fields, IdEntity, Remult, UserInfo } from "remult";
import { getJwtTokenSignKey } from "../AuthService";
import * as jwt from 'jsonwebtoken';
import * as hash from 'password-hash';
import { Roles } from "../Roles";

@Entity("users",
    {
        allowApiCrud: false,
        allowApiRead: Allow.authenticated
    })
export class User extends IdEntity {
    @Fields.string({ dbName: 'שם' })
    name = '';
    @Fields.boolean()
    admin = false;
    @Fields.boolean()
    matcher = false;
    @Fields.boolean()
    caller = false;
    @Fields.string({ includeInApi: false })
    passwordHash = '';

    @BackendMethod({ allowed: true })
    static async signIn(username: string, password: string, remult?: Remult) {

        const user = await remult!.repo(User).findFirst({ name: username });
        if (!user || !username)
            throw new Error("משתמש לא קיים");
        if (!password)
            throw new Error("חובה להזין סיסמה");
        if (user.passwordHash) {
            if (!hash.verify(password, user.passwordHash)) {
                throw new Error("Invalid password");
            }
        }
        else {
            user.passwordHash = hash.generate(password);
            await user.save();
        }
        const info: UserInfo = {
            id: user.id,
            name: user.name,
            roles: []
        }
        if (user.matcher || user.admin)
            info.roles.push(Roles.matcher);
        if (user.caller || user.admin)
            info.roles.push(Roles.caller);
        return jwt.sign(info, getJwtTokenSignKey());
    }
}


