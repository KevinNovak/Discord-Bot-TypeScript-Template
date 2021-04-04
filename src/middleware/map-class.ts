import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export function mapClass(className: any): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const output: any = plainToClass(className, req.body);
        validate(output, { skipMissingProperties: false }).then(errors => {
            if (errors.length > 0) {
                let errorTexts = Array();
                for (const errorItem of errors) {
                    errorTexts = errorTexts.concat(errorItem.constraints);
                }
                res.status(400).send(errorTexts);
                return;
            } else {
                res.locals.input = output;
                next();
            }
        });
    };
}
