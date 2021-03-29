import { ShardingManager } from 'discord.js-light';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { ClusterStats, GetInfoResponse, ShardInfo } from '../models/cluster-api';
import { MathUtils } from '../utils';
import { Controller } from './controller';

let Config = require('../../config/config.json');

export class InfoController implements Controller {
    public path = '/info';
    public router: Router = router();

    constructor(private shardManager: ShardingManager) {
        this.router.get(this.path, (req, res) => this.getInfo(req, res));
    }

    private async getInfo(req: Request, res: Response): Promise<void> {
        let shardDatas = await Promise.all(
            this.shardManager.shards.map(async shard => {
                return {
                    id: shard.id,
                    ready: shard.ready,
                    serverCount: await shard.fetchClientValue('guilds.cache.size'),
                    uptimeSecs: Math.floor((await shard.fetchClientValue('uptime')) / 1000),
                } as ShardInfo;
            })
        );

        let stats: ClusterStats = {
            shardCount: this.shardManager.shards.size,
            serverCount: MathUtils.sum(shardDatas.map(data => data.serverCount)),
            uptimeSecs: Math.floor(process.uptime()),
        };

        let resBody: GetInfoResponse = {
            id: Config.clustering.clusterId,
            shards: shardDatas,
            stats,
        };
        res.status(200).json(resBody);
    }
}
