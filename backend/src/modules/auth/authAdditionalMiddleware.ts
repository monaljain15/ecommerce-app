import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import { authService } from './authService';

export const authAdditionalMiddleware = {
    // Middleware to check if user is already authenticated
    async checkAlreadyAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                return res.status(400).json({
                    success: false,
                    message: 'User is already authenticated'
                });
            }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to validate password reset token
    async validatePasswordResetToken(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Password reset token is required'
                });
            }

            // TODO: Implement token validation
            // const isValidToken = await authService.validatePasswordResetToken(token);
            // if (!isValidToken) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Invalid or expired password reset token'
            //     });
            // }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to add authentication statistics to response
    async addAuthStats(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success) {
                    // TODO: Add authentication statistics to response
                    // const authStats = await authService.getAuthStats();
                    // data.authStats = authStats;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to log authentication events
    async logAuthEvent(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const eventType = req.route?.path.includes('login') ? 'login' :
                req.route?.path.includes('register') ? 'register' :
                    req.route?.path.includes('logout') ? 'logout' : 'auth_event';

            // TODO: Implement authentication event logging
            // await authService.logAuthEvent({
            //     eventType,
            //     ip: req.ip,
            //     userAgent: req.get('User-Agent'),
            //     timestamp: new Date()
            // });

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to check account lockout status
    async checkAccountLockout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            if (email) {
                // TODO: Implement account lockout check
                // const isLocked = await authService.isAccountLocked(email);
                // if (isLocked) {
                //     return res.status(423).json({
                //         success: false,
                //         message: 'Account is temporarily locked due to multiple failed attempts'
                //     });
                // }
            }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to validate email format
    async validateEmailFormat(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid email format'
                    });
                }
            }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to add session information to response
    async addSessionInfo(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && req.user) {
                    // TODO: Add session information to response
                    // const sessionInfo = await authService.getSessionInfo(req.user.id);
                    // data.sessionInfo = sessionInfo;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to check if user needs to change password
    async checkPasswordExpiry(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (req.user) {
                // TODO: Implement password expiry check
                // const needsPasswordChange = await authService.needsPasswordChange(req.user.id);
                // if (needsPasswordChange) {
                //     return res.status(426).json({
                //         success: false,
                //         message: 'Password needs to be changed',
                //         requiresPasswordChange: true
                //     });
                // }
            }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to add security information to response
    async addSecurityInfo(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && req.user) {
                    // TODO: Add security information to response
                    // const securityInfo = await authService.getSecurityInfo(req.user.id);
                    // data.securityInfo = securityInfo;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            return next(error);
        }
    }
};
