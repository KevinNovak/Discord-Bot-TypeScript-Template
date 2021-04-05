import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export function mapClass(cls: ClassConstructor<object>): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Map to class
        let obj: object = plainToClass(cls, req.body);

        // Validate class
        let errors = await validate(obj, {
            skipMissingProperties: true,
            whitelist: true,
            forbidNonWhitelisted: false,
            forbidUnknownValues: false,
        });
        if (errors.length > 0) {
            // TODO: Map recursively for nested errors
            let errorItems = errors.map(error => ({
                property: error.property,
                constraints: error.constraints,
            }));
            res.status(400).send({ error: true, errors: errorItems });
            return;
        }

        // Set validated class to locals
        res.locals.input = obj;
        next();
    };
}
