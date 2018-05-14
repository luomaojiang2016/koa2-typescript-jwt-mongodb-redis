import * as Koa from 'koa';
import * as jwt from 'koa-jwt';
import * as cors from 'koa2-cors';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as enforceHttps from 'koa-sslify';
import * as bodyParser from 'koa-bodyparser';

import { accountRouter } from './routes/account';
import { contractRouter } from './routes/contarct';

import { Response } from './middleware/response';
import { logger } from './utils/logger';
import { HttpRequest } from './utils/httpRequest';
import { mongoConn } from './model/mongoConn';
import { redisSMS } from './model/redisSMS';



const config = require('../config/config.json');
export class App {
    constructor() {

    }
    private async tryInit(): Promise<void> {
        try {
            await mongoConn.tryConnectMongoServer(config.mongodb);
        } catch (eror) {
            logger.error(`connect mongodb fail`);
            process.exit();
        }

        try {
            await redisSMS.tryConnectRedisServer(config.redis,Number(config.sms.effectiveinterval));
        } catch (eror) {
            logger.error(`connect reidis fail`);
            process.exit();
        }

        const app = new Koa();
        app.use(cors());
        app.use(bodyParser({
            enableTypes: ['json', 'form', 'text']
        }));
        //  app.use(jwt({secret: config.jwtsecret}).unless({path:[/\/sendverifictioncode/, /\/createaccount/, /\/isregistered/, /\/login/, /\/resetpassword/]}));     
        app.use(Response.response);
        app.use(async (ctx, next) => {
            const start: any = new Date();
            await next();
            const end: any = new Date();
            const ms = end - start;
            logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
        });

        app.use(accountRouter.routes())
            .use(accountRouter.allowedMethods())
            .use(contractRouter.routes())
            .use(contractRouter.allowedMethods());


        app.listen(process.env.port || config.port);
        logger.info(`server listen at ${config.port}`);

    }
    public async run(): Promise<void> {
        try {
            await this.tryInit();
        } catch (error) {
            logger.error(error);
            process.exit();
        }
    }
}
process.on('uncaughtException', function (err) {
    logger.error(`uncaughtException:${err}`);
  });
 process.on('unhandledRejection', (reason, p) => {
    logger.error("unhandledRejection:Unhandled Rejection at: Promise ", p, " reason: ", reason);

});
export const app = new App();
app.run();






