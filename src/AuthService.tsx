import jwtDecode from 'jwt-decode';
import { Remult } from 'remult';
export class AuthService {

    setAuthToken(token: string) {
        this.remult.setUser(jwtDecode(token));
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    signOut() {
        this.remult.setUser(undefined!);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }

    static fromStorage(): string {
        return sessionStorage.getItem(AUTH_TOKEN_KEY)!;
    }

    constructor(private remult: Remult) {
        const token = AuthService.fromStorage();
        if (token) {
            this.setAuthToken(token);
        }
    }
}

export function getJwtTokenSignKey() {
    if (process.env.NODE_ENV === "production")
        return process.env.TOKEN_SIGN_KEY!;
    return "my secret key";
}

const AUTH_TOKEN_KEY = "authToken";
