import { ShardingManager } from 'discord.js';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { GetGuildsResponse } from '../models/cluster-api';
import { Controller } from './controller';

let Config = require('../../config/config.json');

export class GuildsController implements Controller {
    public path = '/guilds';
    public router: Router = router();
    public authToken: string = Config.api.secret;

    constructor(private shardManager: ShardingManager) {}

    public register(): void {
        this.router.get('/', (req, res) => this.getGuilds(req, res));
    }

    private async getGuilds(req: Request, res: Response): Promise<void> {
        let guilds: string[] = [
            ...new Set(
                (
                    await this.shardManager.broadcastEval(client => [...client.guilds.cache.keys()])
                ).flat()
            ),
        ];

        let resBody: GetGuildsResponse = {
            guilds,
        };
        res.status(200).json(resBody);
    }
}
