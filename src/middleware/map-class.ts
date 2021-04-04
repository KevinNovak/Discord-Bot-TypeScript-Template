import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export function mapClass(cls: ClassConstructor<unknown>): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Map to class
        let output: any = plainToClass(cls, req.body);

        // Validate class
        let errors = await validate(output, { skipMissingProperties: false });
        if (errors.length > 0) {
            let errorTexts = Array();
            for (const errorItem of errors) {
                errorTexts = errorTexts.concat(errorItem.constraints);
            }

            res.status(400).send(errorTexts);
            return;
        }

        // Set validated class to locals
        res.locals.input = output;
        next();
    };
}
