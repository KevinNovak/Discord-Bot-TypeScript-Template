import express, { ErrorRequestHandler, Express, RequestHandler } from 'express';
import util from 'util';

import { Logger } from '../../services';
import { Controller } from '../common/controllers';

let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

export class MasterApi {
    private app: Express;

    constructor(public controllers: Controller[]) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(this.checkAuth);
        this.app.use(this.handleError);
        this.setupControllers();
    }

    public async start(): Promise<void> {
        let listen = util.promisify(this.app.listen.bind(this.app));
        await listen(Config.api.port);
        Logger.info(Logs.info.apiStarted.replace('{PORT}', Config.api.port));
    }

    private setupControllers(): void {
        for (let controller of this.controllers) {
            this.app.use('/', controller.router);
        }
    }

    private checkAuth: RequestHandler = (req, res, next) => {
        if (req.headers.authorization !== Config.api.secret) {
            res.sendStatus(401);
            return;
        }
        next();
    };

    private handleError: ErrorRequestHandler = (error, req, res, next) => {
        Logger.error(
            Logs.error.apiRequest.replace('{HTTP_METHOD}', req.method).replace('{URL}', req.url),
            error
        );
        res.status(500).json({ error: true, message: error.message });
    };
}
