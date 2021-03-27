import { ShardingManager } from 'discord.js-light';

import { Api } from './api';
import { InfoController, PresenceController, RootController } from './controllers';
import { UpdateServerCountJob } from './jobs';
import { Manager } from './manager';
import { HttpService, Logger } from './services';
import { MathUtils, ShardUtils } from './utils';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    Logger.info(Logs.info.started);
    let httpService = new HttpService();

    // Sharding
    let totalShards = 0;
    try {
        totalShards = Debug.override.shardCount.enabled
            ? Debug.override.shardCount.value
            : await ShardUtils.recommendedShards(
                  Config.client.token,
                  Config.sharding.serversPerShard,
                  Config.sharding.shardsPerCluster
              );
    } catch (error) {
        Logger.error(Logs.error.retrieveShardCount, error);
        return;
    }

    let myShardIds = Debug.override.shardCount.enabled
        ? MathUtils.range(0, Debug.override.shardCount.value)
        : ShardUtils.myShardIds(Config.sharding.clusterId, Config.sharding.shardsPerCluster);

    if (myShardIds.length === 0) {
        Logger.warn(Logs.warn.noShards);
        return;
    }

    let shardManager = new ShardingManager('dist/start.js', {
        token: Config.client.token,
        mode: Debug.override.shardMode.enabled ? Debug.override.shardMode.value : 'worker',
        respawn: true,
        totalShards,
        shardList: myShardIds,
    });

    let updateServerCountJob = new UpdateServerCountJob(
        Config.jobs.updateServerCount.schedule,
        shardManager,
        httpService
    );

    let manager = new Manager(shardManager, [updateServerCountJob]);

    // API
    let rootController = new RootController();
    let infoController = new InfoController(shardManager);
    let presenceController = new PresenceController(shardManager);
    let api = new Api([rootController, infoController, presenceController]);

    // Start
    await manager.start();
    await api.start();
}

start();
