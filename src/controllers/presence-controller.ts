import { ShardingManager } from 'discord.js-light';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { UpdatePresenceRequest } from '../models/cluster-api';
import { Controller } from './controller';

export class PresenceController implements Controller {
    public path = '/presence';
    public router: Router = router();

    constructor(private shardManager: ShardingManager) {
        this.router.put(this.path, (req, res) => this.updatePresence(req, res));
    }

    private async updatePresence(req: Request, res: Response): Promise<void> {
        let reqBody = req.body as UpdatePresenceRequest;

        await this.shardManager.broadcastEval(`
            (async () => {
                return await this.setPresence('${reqBody.type}', '${reqBody.name}', '${reqBody.url}');
            })();
        `);

        res.sendStatus(200);
    }
}
