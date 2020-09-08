import { BotSiteConfig } from '../../models/config-models';
import { HttpService } from '../http-service';
import { BotSite } from './bot-site';

export class TopGgSite implements BotSite {
    public enabled = false;
    public name = 'top.gg';

    constructor(private config: BotSiteConfig, private httpService: HttpService) {
        this.enabled = this.config.enabled;
    }

    public async updateServerCount(serverCount: number): Promise<void> {
        let res = await this.httpService.post(this.config.url, this.config.token, {
            server_count: serverCount,
        });

        if (!res.ok) {
            throw res;
        }
    }
}
