import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../types';
import { authService } from './authService';

export const authController = {
    // @route   POST /api/auth/register
    // @desc    Register user
    // @access  Public
    async register(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
                return;
            }

            const { name, email, password } = req.body;
            const result = await authService.register(name, email, password);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/auth/login
    // @desc    Login user
    // @access  Public
    async login(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
                return;
            }

            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/auth/logout
    // @desc    Logout user
    // @access  Private
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await authService.logout(req.user?.id);

            res.json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/auth/forgot-password
    // @desc    Forgot password
    // @access  Public
    async forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email);

            res.json({
                success: true,
                message: 'Password reset email sent'
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/auth/reset-password
    // @desc    Reset password
    // @access  Public
    async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { token, password } = req.body;
            await authService.resetPassword(token, password);

            res.json({
                success: true,
                message: 'Password reset successful'
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/auth/refresh-token
    // @desc    Refresh access token
    // @access  Public
    async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);

            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: result
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/auth/change-password
    // @desc    Change password
    // @access  Private
    async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
                return;
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { currentPassword, newPassword } = req.body;
            await authService.changePassword(userId, currentPassword, newPassword);

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/auth/verify-email
    // @desc    Verify email
    // @access  Public
    async verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            await authService.verifyEmail(token);

            res.json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            return next(error);
        }
    }
};
