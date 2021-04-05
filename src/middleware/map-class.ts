import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export function mapClass<T>(cls: ClassConstructor<T>): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Map to class
        let object: T = plainToClass(cls, req.body);

        // Validate class
        let errors = await validate(object, {
            skipMissingProperties: true,
            whitelist: true,
            forbidNonWhitelisted: false,
            forbidUnknownValues: true,
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
        res.locals.input = object;
        next();
    };
}
