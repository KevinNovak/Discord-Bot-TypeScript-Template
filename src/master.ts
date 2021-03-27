import { RootController } from './api/master/controllers';
import { MasterApi } from './api/master/master-api';
import { Logger } from './services';

let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    Logger.info(Logs.info.started);

    // API
    let rootController = new RootController();
    let api = new MasterApi([rootController]);

    // Start
    await api.start();
}

start();
