import { BotSiteConfig } from '../../models/config-models';
import { HttpService } from '../http-service';
import { BotSite } from './bot-site';

export class DiscordBotsGgSite implements BotSite {
    public enabled = false;
    public name = 'discord.bots.gg';

    constructor(private config: BotSiteConfig, private httpService: HttpService) {
        this.enabled = this.config.enabled;
    }

    public async updateServerCount(serverCount: number): Promise<void> {
        let res = await this.httpService.post(this.config.url, this.config.token, {
            guildCount: serverCount,
        });

        if (!res.ok) {
            throw res;
        }
    }
}
