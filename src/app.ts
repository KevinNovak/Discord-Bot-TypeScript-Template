import { ShardingManager } from 'discord.js-light';

import { ClusterApi } from './api/cluster/cluster-api';
import { InfoController, PresenceController, RootController } from './api/cluster/controllers';
import { UpdateServerCountJob } from './jobs';
import { Manager } from './manager';
import { HttpService, Logger, MasterService } from './services';
import { MathUtils, ShardUtils } from './utils';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    Logger.info(Logs.info.started);

    // Dependencies
    let httpService = new HttpService();
    let masterService = new MasterService(httpService);

    // Sharding
    let recommendedShards = 0;
    try {
        recommendedShards = await ShardUtils.recommendedShards(
            Config.client.token,
            Config.sharding.serversPerShard
        );
    } catch (error) {
        Logger.error(Logs.error.retrieveShardCount, error);
        return;
    }

    let myShardIds: number[] = [];
    if (Config.clustering.enabled) {
        try {
            myShardIds = await masterService.myShardIds();
        } catch (error) {
            Logger.error(Logs.error.retrieveShardIds, error);
            return;
        }
    } else {
        myShardIds = MathUtils.range(0, recommendedShards);
    }

    if (myShardIds.length === 0) {
        Logger.warn(Logs.warn.noShards);
        return;
    }

    // TODO: Is this "Math.max + 1" going to cause issues? Does it really need the accurate total?
    let totalShardCount = Config.clustering.enabled
        ? Math.max(...myShardIds) + 1
        : recommendedShards;

    let shardManager = new ShardingManager('dist/start.js', {
        token: Config.client.token,
        mode: Debug.override.shardMode.enabled ? Debug.override.shardMode.value : 'worker',
        respawn: true,
        totalShards: totalShardCount,
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
    let api = new ClusterApi([rootController, infoController, presenceController]);

    // Start
    await manager.start();
    await api.start();
}

start();
