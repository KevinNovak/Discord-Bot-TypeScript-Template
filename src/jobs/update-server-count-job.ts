import { ShardingManager } from 'discord.js';
import schedule from 'node-schedule';

import { Logger } from '../services';
import { BotSite } from '../services/sites';
import { Job } from './job';

let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class UpdateServerCountJob implements Job {
    constructor(
        public schedule: string,
        private shardManager: ShardingManager,
        private botSites: BotSite[]
    ) {}

    public async run(): Promise<void> {
        let serverCount = await this.retrieveServerCount();
        await this.shardManager.broadcastEval(`
            this.user.setPresence({
                activity: {
                    name: 'to ${serverCount.toLocaleString()} servers',
                    type: "STREAMING",
                    url: "${Config.links.stream}"
                }
            });
        `);

        Logger.info(
            Logs.info.updatedServerCount.replace('{SERVER_COUNT}', serverCount.toLocaleString())
        );

        for (let botSite of this.botSites) {
            try {
                await botSite.updateServerCount(serverCount);
            } catch (error) {
                Logger.error(
                    Logs.error.updateServerCountSite.replace('{BOT_SITE}', botSite.name),
                    error
                );
                continue;
            }

            Logger.info(Logs.info.updateServerCountSite.replace('{BOT_SITE}', botSite.name));
        }
    }

    public start(): void {
        schedule.scheduleJob(this.schedule, async () => {
            try {
                await this.run();
            } catch (error) {
                Logger.error(Logs.error.updateServerCount, error);
            }
        });
    }

    private async retrieveServerCount(): Promise<number> {
        let shardSizes = await this.shardManager.fetchClientValues('guilds.cache.size');
        return shardSizes.reduce((prev, val) => prev + val, 0);
    }
}
