import { ShardingManager } from 'discord.js-light';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { GetGuildsResponse } from '../models/cluster-api';
import { Controller } from './controller';

export class GuildsController implements Controller {
    public path = '/guilds';
    public router: Router = router();

    constructor(private shardManager: ShardingManager) {
        this.router.get(this.path, (req, res) => this.getGuilds(req, res));
    }

    private async getGuilds(req: Request, res: Response): Promise<void> {
        let guilds: string[] = [
            ...new Set(
                (await this.shardManager.broadcastEval('this.guilds.cache.keyArray()')).flat()
            ),
        ];

        let resBody: GetGuildsResponse = {
            guilds,
        };
        res.status(200).json(resBody);
    }
}
