import { ShardingManager } from 'discord.js';
import { Manager } from './manager';
import { HttpService } from './services/http-service';
import { Logger } from './services/logger';
import { BotsOnDiscordXyzSite } from './services/sites/bots-on-discord-xyz-site';
import { DiscordBotListComSite } from './services/sites/discord-bot-list-com-site';
import { DiscordBotsGgSite } from './services/sites/discord-bots-gg-site';
import { TopGgSite } from './services/sites/top-gg-site';
import { ShardUtils } from './utils/shard-utils';

let Config = require('../config/config.json');
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
        totalShards = await ShardUtils.getRecommendedShards(
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

    let manager = new Manager(shardManager, [
        topGgSite,
        botsOnDiscordXyzSite,
        discordBotsGgSite,
        discordBotListComSite,
    ]);

    // Start
    await manager.start();
    setInterval(() => {
        manager.updateServerCount();
    }, Config.updateInterval * 1000);
}

start();
