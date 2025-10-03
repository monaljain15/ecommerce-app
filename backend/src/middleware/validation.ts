import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

// Validation middleware for request body
export const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.details[0].message
            });
        }
        next();
    };
};

// Validation middleware for query parameters
export const validateQuery = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.details[0].message
            });
        }
        next();
    };
};

// Validation middleware for URL parameters
export const validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.details[0].message
            });
        }
        next();
    };
};

// Combined validation middleware for both body and query
export const validateRequestAndQuery = (bodySchema?: Joi.ObjectSchema, querySchema?: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let hasError = false;
        let errorMessage = '';

        // Validate body if schema provided
        if (bodySchema) {
            const bodyError = bodySchema.validate(req.body);
            if (bodyError.error) {
                hasError = true;
                errorMessage = bodyError.error.details[0].message;
            }
        }

        // Validate query if schema provided and no body error
        if (querySchema && !hasError) {
            const queryError = querySchema.validate(req.query);
            if (queryError.error) {
                hasError = true;
                errorMessage = queryError.error.details[0].message;
            }
        }

        if (hasError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: errorMessage
            });
        }

        next();
    };
};
