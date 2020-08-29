import { ShardingManager } from 'discord.js';

import { UpdateServerCountJob } from './jobs';
import { Manager } from './manager';
import { HttpService, Logger } from './services';
import {
    BotsOnDiscordXyzSite,
    DiscordBotListComSite,
    DiscordBotsGgSite,
    TopGgSite,
} from './services/sites';
import { ShardUtils } from './utils';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    Logger.info(Logs.info.started);
    let httpService = new HttpService();

    // Bot sites
    let topGgSite = new TopGgSite(Config.botSites.topGg, httpService);
    let botsOnDiscordXyzSite = new BotsOnDiscordXyzSite(
        Config.botSites.botsOnDiscordXyz,
        httpService
    );
    let discordBotsGgSite = new DiscordBotsGgSite(Config.botSites.discordBotsGg, httpService);
    let discordBotListComSite = new DiscordBotListComSite(
        Config.botSites.discordBotListCom,
        httpService
    );

    // Sharding
    let totalShards = 0;
    try {
        totalShards = Debug.override.shardCount.enabled
            ? Debug.override.shardCount.value
            : await ShardUtils.getRecommendedShards(
                  Config.client.token,
                  Config.sharding.serversPerShard
              );
    } catch (error) {
        Logger.error(Logs.error.retrieveShardCount, error);
        return;
    }

    let myShardIds = ShardUtils.getMyShardIds(
        totalShards,
        Config.sharding.machineId,
        Config.sharding.machineCount
    );

    if (myShardIds.length === 0) {
        Logger.warn(Logs.warn.noShards);
        return;
    }

    let shardManager = new ShardingManager('dist/start.js', {
        token: Config.client.token,
        mode: 'worker',
        respawn: true,
        totalShards,
        shardList: myShardIds,
    });

    let updateServerCountJob = new UpdateServerCountJob(
        Config.jobs.updateServerCount.schedule,
        shardManager,
        [topGgSite, botsOnDiscordXyzSite, discordBotsGgSite, discordBotListComSite].filter(
            botSite => botSite.enabled
        )
    );

    let manager = new Manager(shardManager, [updateServerCountJob]);

    // Start
    await manager.start();
}

start();
