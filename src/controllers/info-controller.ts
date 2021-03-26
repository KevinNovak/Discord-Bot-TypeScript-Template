import { ShardingManager } from 'discord.js-light';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { ShardUtils } from '../utils';
import { Controller } from './controller';

export class InfoController implements Controller {
    public path = '/info';
    public router: Router = router();

    constructor(private shardManager: ShardingManager) {
        this.router.get(this.path, (req, res) => this.get(req, res));
    }

    private async get(req: Request, res: Response): Promise<void> {
        let shardIds = this.shardManager.shards.map(shard => shard.id);
        let serverCount = await ShardUtils.serverCount(this.shardManager);
        res.status(200).json({ shardIds, serverCount });
    }
}
