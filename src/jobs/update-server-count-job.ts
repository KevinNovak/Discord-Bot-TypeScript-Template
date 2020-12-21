import { ShardingManager } from 'discord.js';
import schedule from 'node-schedule';

import { BotSite } from '../models/config-models';
import { HttpService, Lang, Logger } from '../services';
import { ShardUtils } from '../utils';
import { Job } from './job';

let Config = require('../../config/config.json');
let BotSites: BotSite[] = require('../../config/bot-sites.json');
let Logs = require('../../lang/logs.json');

export class UpdateServerCountJob implements Job {
    private botSites: BotSite[];

    constructor(
        public schedule: string,
        private shardManager: ShardingManager,
        private httpService: HttpService
    ) {
        this.botSites = BotSites.filter(botSite => botSite.enabled);
    }

    public async run(): Promise<void> {
        let serverCount = await ShardUtils.retrieveServerCount(this.shardManager);
        await this.shardManager.broadcastEval(`
            this.user.setPresence({
                activity: {
                    name: 'to ${serverCount.toLocaleString()} servers',
                    type: "STREAMING",
                    url: "${Lang.getRef('linkStream', 'en')}"
                }
            });
        `);

        Logger.info(
            Logs.info.updatedServerCount.replace('{SERVER_COUNT}', serverCount.toLocaleString())
        );

        for (let botSite of this.botSites) {
            try {
                let body = JSON.parse(
                    botSite.body.replace('{{SERVER_COUNT}}', serverCount.toString())
                );
                let res = await this.httpService.post(botSite.url, botSite.authorization, body);

                if (!res.ok) {
                    throw res;
                }
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
}
