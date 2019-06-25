'use strict';

import * as fs from 'fs';
import * as https from 'https';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaCompose from 'koa-compose';
import * as compress from 'koa-compress';
import * as path from 'path';
import * as swagger from 'swagger2';

import { ui } from 'swagger2-koa';

import config from './config';

// routes:
// if you have a large number of routes, you can create a function to compose these elsewhere.
import HealthRoute from './routes/health';
import SlackRoute from './routes/slack';

const options = {
    cert: fs
        .readFileSync(
            path.resolve(process.cwd(), '/etc/letsencrypt/live/proj.noahzeml.in/fullchain.pem'),
            'utf8'
        )
        .toString(),
    key: fs
        .readFileSync(
            path.resolve(process.cwd(), '/etc/letsencrypt/live/proj.noahzeml.in/privkey.pem'),
            'utf8'
        )
        .toString(),
};

class Server {
    private server: Koa;

    constructor() {
        this.server = new Koa();

        const handleError = async (ctx: Koa.Context, next: () => void) => {
            try {
                await next();
            } catch (e) {
                ctx.body = e;
                ctx.status = e.response_code || 500;
            }
        };

        // middleware to compress responses greater than 1kb
        const compressResponse = compress({
            flush: require('zlib').Z_SYNC_FLUSH,
            threshold: 1024,
        });

        // compose all middlewares
        const middleware = KoaCompose([
            compressResponse,
            handleError,
            bodyParser(),
            SlackRoute.getRoutes(),
            HealthRoute.getRoutes(),
            ui(swagger.loadDocumentSync('./swagger.yml')),
        ]);

        try {
            const httpsServer = https.createServer(options, this.server.callback()).listen(443);
            httpsServer.listen(443, () => {
                console.log(`HTTPS server OK`);
            });
        } catch (ex) {
            console.error('Failed to start HTTPS server\n', ex, ex && ex.stack);
        }

        // load middlewares
        this.server.use(middleware);
    }

    /**
     * Start HTTP REST Server
     */
    public start() {
        return new Promise<any>((resolve: any, reject: any) => {
            this.server.listen(config.port, () => {
                resolve();
            });
        });
    }
}

const server = new Server();

export default server;
