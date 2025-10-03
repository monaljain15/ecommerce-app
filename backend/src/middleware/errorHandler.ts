import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 } as AppError;
    }

    // Mongoose duplicate key
    if (err.name === 'MongoError' && (err as any).code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 } as AppError;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
        error = { message, statusCode: 400 } as AppError;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};
