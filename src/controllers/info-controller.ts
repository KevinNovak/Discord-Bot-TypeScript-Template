import { ShardingManager } from 'discord.js-light';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { ClusterStats, GetInfoResponse, ShardInfo } from '../models/cluster-api';
import { Logger } from '../services';
import { Controller } from './controller';

let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class InfoController implements Controller {
    public path = '/info';
    public router: Router = router();

    constructor(private shardManager: ShardingManager) {
        this.router.get(this.path, (req, res) => this.getInfo(req, res));
    }

    private async getInfo(req: Request, res: Response): Promise<void> {
        let shardDatas = await Promise.all(
            this.shardManager.shards.map(async shard => {
                let shardInfo: ShardInfo = {
                    id: shard.id,
                    ready: shard.ready,
                    error: false,
                };

                try {
                    shardInfo.uptimeSecs = Math.floor(
                        (await shard.fetchClientValue('uptime')) / 1000
                    );
                } catch (error) {
                    Logger.error(Logs.error.shardInfo, error);
                    shardInfo.error = true;
                }

                return shardInfo;
            })
        );

        let stats: ClusterStats = {
            shardCount: this.shardManager.shards.size,
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
