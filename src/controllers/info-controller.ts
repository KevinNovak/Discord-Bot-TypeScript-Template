import { ShardingManager } from 'discord.js-light';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';
import { InfoResponse } from '../models/cluster-api';

import { ShardUtils } from '../utils';
import { Controller } from './controller';

export class InfoController implements Controller {
    public path = '/info';
    public router: Router = router();

    constructor(private shardManager: ShardingManager) {
        this.router.get(this.path, (req, res) => this.getInfo(req, res));
    }

    private async getInfo(req: Request, res: Response): Promise<void> {
        let shardIds = ShardUtils.shardIds(this.shardManager);
        let serverCount = await ShardUtils.serverCount(this.shardManager);
        let uptimeSecs = Math.floor(process.uptime());

        let resBody: InfoResponse = { shardIds, serverCount, uptimeSecs };
        res.status(200).json(resBody);
    }
}
