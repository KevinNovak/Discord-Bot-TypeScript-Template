import { ShardingManager } from 'discord.js';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { CustomClient } from '../extensions';
import { mapClass } from '../middleware';
import {
    GetShardsResponse,
    SetShardPresencesRequest,
    ShardInfo,
    ShardStats,
} from '../models/cluster-api';
import { Logger } from '../services';
import { Controller } from './controller';

let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class ShardsController implements Controller {
    public path = '/shards';
    public router: Router = router();
    public authToken: string = Config.api.secret;

    constructor(private shardManager: ShardingManager) {}

    public register(): void {
        this.router.get('/', (req, res) => this.getShards(req, res));
        this.router.put('/presence', mapClass(SetShardPresencesRequest), (req, res) =>
            this.setShardPresences(req, res)
        );
    }

    private async getShards(req: Request, res: Response): Promise<void> {
        let shardDatas = await Promise.all(
            this.shardManager.shards.map(async shard => {
                let shardInfo: ShardInfo = {
                    id: shard.id,
                    ready: shard.ready,
                    error: false,
                };

                try {
                    let uptime = (await shard.fetchClientValue('uptime')) as number;
                    shardInfo.uptimeSecs = Math.floor(uptime / 1000);
                } catch (error) {
                    Logger.error(Logs.error.managerShardInfo, error);
                    shardInfo.error = true;
                }

                return shardInfo;
            })
        );

        let stats: ShardStats = {
            shardCount: this.shardManager.shards.size,
            uptimeSecs: Math.floor(process.uptime()),
        };

        let resBody: GetShardsResponse = {
            shards: shardDatas,
            stats,
        };
        res.status(200).json(resBody);
    }

    private async setShardPresences(req: Request, res: Response): Promise<void> {
        let reqBody: SetShardPresencesRequest = res.locals.input;

        await this.shardManager.broadcastEval(
            (client, context) => {
                let customClient = client as CustomClient;
                return customClient.setPresence(context.type, context.name, context.url);
            },
            { context: { type: reqBody.type, name: reqBody.name, url: reqBody.url } }
        );

        res.sendStatus(200);
    }
}
