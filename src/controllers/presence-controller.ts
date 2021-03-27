import { ActivityType, ShardingManager } from 'discord.js-light';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { Controller } from './controller';

export class PresenceController implements Controller {
    public path = '/presence';
    public router: Router = router();

    constructor(private shardManager: ShardingManager) {
        this.router.put(this.path, (req, res) => this.put(req, res));
    }

    private async put(req: Request, res: Response): Promise<void> {
        let type = req.body.type as ActivityType;
        let name: string = req.body.name;
        let url: string = req.body.url;

        if (!(name && type && url)) {
            res.sendStatus(400);
        }

        await this.shardManager.broadcastEval(`
            (async () => {
                return await this.setPresence('${type}', '${name}', '${url}');
            })();
        `);

        res.sendStatus(200);
    }
}
