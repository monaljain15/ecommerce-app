import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, JWTPayload, AuthRequest } from '../../types';
import { AppError } from '../../middleware/errorHandler';

// Mock user data - replace with actual database operations
const users: User[] = [];

export const authMiddleware = {
    // Authenticate JWT token
    authenticate: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new AppError('Access denied. No token provided.', 401);
            }

            const token = authHeader.substring(7);

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;

                // Find user
                const user = users.find(u => u.id === decoded.userId);
                if (!user) {
                    throw new AppError('User not found', 401);
                }

                req.user = user;
                next();
            } catch (error) {
                throw new AppError('Invalid token', 401);
            }
        } catch (error) {
            next(error);
        }
    },

    // Authorize user roles
    authorize: (...roles: string[]) => {
        return (req: AuthRequest, res: Response, next: NextFunction) => {
            try {
                if (!req.user) {
                    throw new AppError('Access denied. User not authenticated.', 401);
                }

                if (!roles.includes(req.user.role)) {
                    throw new AppError('Access denied. Insufficient permissions.', 403);
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    },

    // Optional authentication (doesn't throw error if no token)
    optionalAuth: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return next();
            }

            const token = authHeader.substring(7);

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;

                // Find user
                const user = users.find(u => u.id === decoded.userId);
                if (user) {
                    req.user = user;
                }

                next();
            } catch (error) {
                // Invalid token, but continue without user
                next();
            }
        } catch (error) {
            next();
        }
    }
};
