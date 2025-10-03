import express from 'express';
import { authController } from './authController';
import { authMiddleware } from './authMiddleware';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    verifyEmailSchema,
    refreshTokenSchema
} from '../../schemas/authSchemas';

const router = express.Router();

// Validation middleware
const validateRequest = (schema: any) => {
    return (req: any, res: any, next: any) => {
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

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRequest(registerSchema), authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateRequest(loginSchema), authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware.authenticate, authController.logout);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', authMiddleware.authenticate, validateRequest(changePasswordSchema), authController.changePassword);

// @route   POST /api/auth/verify-email
// @desc    Verify email
// @access  Public
router.post('/verify-email', validateRequest(verifyEmailSchema), authController.verifyEmail);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);

export default router;
