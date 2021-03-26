import express, { ErrorRequestHandler, Express } from 'express';
import util from 'util';

import { Controller } from './controllers';
import { Logger } from './services';

let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

export class Api {
    private app: Express;

    constructor(public controllers: Controller[]) {
        this.app = express();
        this.app.use(express.json());
        this.setupControllers();
    }

    public async start(): Promise<void> {
        let listen = util.promisify(this.app.listen.bind(this.app));
        await listen(Config.api.port);
        Logger.info(Logs.info.apiStarted.replace('{PORT}', Config.api.port));
    }

    private setupControllers(): void {
        for (let controller of this.controllers) {
            controller.router.use(this.handleError);
            this.app.use('/', controller.router);
        }
    }

    private handleError: ErrorRequestHandler = (error, req, res, next) => {
        Logger.error(
            Logs.error.apiRequest.replace('{HTTP_METHOD}', req.method).replace('{URL}', req.url),
            error
        );
        res.status(500).json({ error: true, message: error.message });
    };
}
