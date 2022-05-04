import express from "express";
import { remultExpress } from "remult/remult-express";
import "../common/families";
import '../common/Matches';
import '../common/Users';
import compression from 'compression';
import helmet from 'helmet';
import * as fs from "fs";
import expressJwt from 'express-jwt';
import { getJwtTokenSignKey } from '../AuthService';
import { GoogleSheetsDataProvider } from "./GoogleSheetDataProvider";
import sslRedirect from 'heroku-ssl-redirect';
import { config } from 'dotenv';

config();
let app = express();
app.use(sslRedirect());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(expressJwt({
    secret: getJwtTokenSignKey(),
    credentialsRequired: false,
    algorithms: ['HS256']
}));
let credentials = process.env.private_key;
if (!credentials) {
    credentials = fs.readFileSync('client_secret.json').toString();
}

app.use(remultExpress({
    dataProvider: async () => {

        return new GoogleSheetsDataProvider(JSON.parse(credentials!), {
            sheetId: process.env.sheet_id||'1ub9ybA0g3gmPLLHGfbc2HHuNsdVrJAqVkdj_ccmc8-g',
            optimisticUpdates: true,
            secondsToCacheQueries: 5
        });
    },
    initApi: async remult => {
        return;
    },
})
);
app.use(express.static('build'));
app.use('/*', async (req, res) => {
    res.sendFile(process.cwd() + '/build/index.html');
});
app.listen(process.env.PORT || 3002, () => console.log("Server started"));


