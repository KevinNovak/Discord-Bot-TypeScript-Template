import { ShardingManager } from 'discord.js-light';

import { Api } from './api';
import { InfoController, PresenceController, RootController } from './controllers';
import { UpdateServerCountJob } from './jobs';
import { Manager } from './manager';
import { HttpService, Logger, MasterService } from './services';
import { MathUtils, ShardUtils } from './utils';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    Logger.info(Logs.info.started);
    let httpService = new HttpService();

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

    // TODO: What if master service call fails
    let myShardIds = Config.clustering.enabled
        ? await MasterService.myShardIds(Config.clustering.clusterId, Config.clustering.shardCount)
        : MathUtils.range(0, recommendedShards);

    if (myShardIds.length === 0) {
        Logger.warn(Logs.warn.noShards);
        return;
    }

    // TODO: Is this "Math.max + 1" going to cause issues?
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
    let api = new Api([rootController, infoController, presenceController]);

    // Start
    await manager.start();
    await api.start();
}

start();
