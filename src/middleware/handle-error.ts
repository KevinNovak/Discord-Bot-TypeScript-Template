import { ErrorRequestHandler } from 'express';
import { Logger } from '../services';

let Logs = require('../../lang/logs.json');

export function handleError(): ErrorRequestHandler {
    return (error, req, res, next) => {
        Logger.error(
            Logs.error.apiRequest.replace('{HTTP_METHOD}', req.method).replace('{URL}', req.url),
            error
        );
        res.status(500).json({ error: true, message: error.message });
    };
}
