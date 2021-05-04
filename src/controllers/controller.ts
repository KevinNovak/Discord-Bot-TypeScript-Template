import { Router } from 'express';

export interface Controller {
    path: string;
    router: Router;
    authToken?: string;
    register(): void;
}
