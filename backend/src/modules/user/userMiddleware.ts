import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import { userService } from './userService';

export const userMiddleware = {
    // Middleware to check if user exists
    async checkUserExists(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id || req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            // TODO: Implement database check to verify user exists
            // const user = await userService.getUserById(userId);
            // if (!user) {
            //     return res.status(404).json({
            //         success: false,
            //         message: 'User not found'
            //     });
            // }

            // req.targetUser = user;
            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to check if user is active
    async checkUserActive(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id || req.user?.id;

            // TODO: Implement check to verify user is active
            // const user = await userService.getUserById(userId);
            // if (!user.isActive) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'User account is deactivated'
            //     });
            // }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to add user statistics to response
    async addUserStats(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && req.user?.id) {
                    // TODO: Add user statistics to response
                    // const userStats = await userService.getUserStats(req.user.id);
                    // data.userStats = userStats;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to validate profile update data
    async validateProfileUpdate(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { name, email } = req.body;

            // Check if email is being changed and validate uniqueness
            if (email && email !== req.user?.email) {
                // TODO: Implement email uniqueness check
                // const existingUser = await userService.getUserByEmail(email);
                // if (existingUser && existingUser.id !== req.user?.id) {
                //     return res.status(400).json({
                //         success: false,
                //         message: 'Email already exists'
                //     });
                // }
            }

            // Validate name length
            if (name && (name.length < 2 || name.length > 50)) {
                return res.status(400).json({
                    success: false,
                    message: 'Name must be between 2 and 50 characters'
                });
            }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to handle avatar upload
    async handleAvatarUpload(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // TODO: Implement avatar upload handling
            // This would typically use multer or similar middleware
            // to handle file uploads for user avatars
            // Validate file type, size, etc.

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware for avatar upload (alias for handleAvatarUpload)
    async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // TODO: Implement avatar upload handling
            // This would typically use multer or similar middleware
            // to handle file uploads for user avatars
            // Validate file type, size, etc.

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to add user activity to response
    async addUserActivity(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && req.user?.id) {
                    // TODO: Add user activity information to response
                    // const userActivity = await userService.getUserActivity(req.user.id);
                    // data.userActivity = userActivity;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to validate password change
    async validatePasswordChange(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Validate password strength
            if (newPassword && newPassword.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 8 characters long'
                });
            }

            // Check if new password is different from current
            if (currentPassword === newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be different from current password'
                });
            }

            // TODO: Verify current password
            // const isValidPassword = await userService.verifyPassword(req.user?.id, currentPassword);
            // if (!isValidPassword) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Current password is incorrect'
            //     });
            // }

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to add user preferences to response
    async addUserPreferences(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && req.user?.id) {
                    // TODO: Add user preferences to response
                    // const userPreferences = await userService.getUserPreferences(req.user.id);
                    // data.userPreferences = userPreferences;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to check if user can be modified by admin
    async checkUserModifiable(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const targetUserId = req.params.id;
            const currentUserId = req.user?.id;

            // Prevent users from modifying their own status
            if (targetUserId === currentUserId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot modify your own account status'
                });
            }

            // TODO: Add additional checks for user modification permissions

            next();
        } catch (error) {
            return next(error);
        }
    },

    // Middleware to add user roles and permissions to response
    async addUserRoles(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && data.data && data.data.id) {
                    // TODO: Add user roles and permissions to response
                    // const userRoles = await userService.getUserRoles(data.data.id);
                    // data.data.roles = userRoles;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            return next(error);
        }
    }
};
