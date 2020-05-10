import { ShardingManager } from 'discord.js';

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
let Logs = require('../lang/logs.json');
let Debug = require('../config/debug.json');

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
        totalShards =
            Debug.enabled && Debug.overrideShardCount
                ? Debug.shardCount
                : await ShardUtils.getRecommendedShards(
                      Config.token,
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
        token: Config.token,
        mode: 'worker',
        respawn: true,
        totalShards,
        shardList: myShardIds,
    });

    let manager = new Manager(
        shardManager,
        [topGgSite, botsOnDiscordXyzSite, discordBotsGgSite, discordBotListComSite].filter(
            botSite => botSite.enabled
        )
    );

    // Start
    await manager.start();

    // Start schedule to update server count
    setInterval(async () => {
        try {
            await manager.updateServerCount();
        } catch (error) {
            Logger.error(Logs.error.updateServerCount, error);
        }
    }, Config.updateInterval * 1000);
}

start();
