import { ActivityType, ShardingManager } from 'discord.js';

import { CustomClient } from '../extensions';
import { BotSite } from '../models/config-models';
import { HttpService, Lang, Logger } from '../services';
import { ShardUtils } from '../utils';
import { Job } from './job';

let Config = require('../../config/config.json');
let BotSites: BotSite[] = require('../../config/bot-sites.json');
let Logs = require('../../lang/logs.json');

export class UpdateServerCountJob implements Job {
    public name = 'Update Server Count';
    public schedule: string = Config.jobs.updateServerCount.schedule;
    public log: boolean = Config.jobs.updateServerCount.log;

    private botSites: BotSite[];

    constructor(private shardManager: ShardingManager, private httpService: HttpService) {
        this.botSites = BotSites.filter(botSite => botSite.enabled);
    }

    public async run(): Promise<void> {
        let serverCount = await ShardUtils.serverCount(this.shardManager);

        let type: ActivityType = 'STREAMING';
        let name = `to ${serverCount.toLocaleString()} servers`;
        let url = Lang.getCom('links.stream');

        await this.shardManager.broadcastEval(
            (client, context) => {
                let customClient = client as CustomClient;
                return customClient.setPresence(context.type, context.name, context.url);
            },
            { context: { type, name, url } }
        );

        Logger.info(
            Logs.info.updatedServerCount.replaceAll('{SERVER_COUNT}', serverCount.toLocaleString())
        );

        for (let botSite of this.botSites) {
            try {
                let body = JSON.parse(
                    botSite.body.replaceAll('{{SERVER_COUNT}}', serverCount.toString())
                );
                let res = await this.httpService.post(botSite.url, botSite.authorization, body);

                if (!res.ok) {
                    throw res;
                }
            } catch (error) {
                Logger.error(
                    Logs.error.updatedServerCountSite.replaceAll('{BOT_SITE}', botSite.name),
                    error
                );
                continue;
            }

            Logger.info(Logs.info.updatedServerCountSite.replaceAll('{BOT_SITE}', botSite.name));
        }
    }
}
