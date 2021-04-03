import { ShardingManager } from 'discord.js-light';

import { Api } from './api';
import {
    GuildsController,
    InfoController,
    PresenceController,
    RootController,
} from './controllers';
import { UpdateServerCountJob } from './jobs';
import { Manager } from './manager';
import { HttpService, JobService, Logger, MasterApiService } from './services';
import { MathUtils, ShardUtils } from './utils';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    Logger.info(Logs.info.started);

    // Dependencies
    let httpService = new HttpService();
    let masterApiService = new MasterApiService(httpService);
    await masterApiService.register();

    // Sharding
    let shardList: number[];
    let totalShards: number;
    try {
        if (Config.clustering.enabled) {
            let resBody = await masterApiService.login();
            shardList = resBody.shardList;
            totalShards = resBody.totalShards;
        } else {
            let recommendedShards = await ShardUtils.recommendedShards(
                Config.client.token,
                Config.sharding.serversPerShard
            );
            shardList = MathUtils.range(0, recommendedShards);
            totalShards = recommendedShards;
        }
    } catch (error) {
        Logger.error(Logs.error.retrieveShards, error);
        return;
    }

    if (shardList.length === 0) {
        Logger.warn(Logs.warn.noShards);
        return;
    }

    let shardManager = new ShardingManager('dist/start.js', {
        token: Config.client.token,
        mode: Debug.override.shardMode.enabled ? Debug.override.shardMode.value : 'worker',
        respawn: true,
        totalShards,
        shardList,
    });

    let jobService = new JobService([new UpdateServerCountJob(shardManager, httpService)]);

    let manager = new Manager(shardManager, jobService);

    // API
    let guildsController = new GuildsController(shardManager);
    let infoController = new InfoController(shardManager);
    let presenceController = new PresenceController(shardManager);
    let rootController = new RootController();
    let api = new Api([guildsController, infoController, presenceController, rootController]);

    // Start
    await manager.start();
    await api.start();
    await masterApiService.ready();
}

start();
