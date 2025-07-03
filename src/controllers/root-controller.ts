import { Request, Response, Router } from 'express';

import { Controller } from './index.js';

export class RootController implements Controller {
    public path = '/';
    public router: Router = Router();

    public register(): void {
        this.router.get('/', (req, res) => this.get(req, res));
    }

    private async get(req: Request, res: Response): Promise<void> {
        res.status(200).json({ name: 'Discord Bot Cluster API', author: 'Kevin Novak' });
    }
}
