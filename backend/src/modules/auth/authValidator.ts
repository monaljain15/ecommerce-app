import { body } from 'express-validator';

export const authValidator = {
    validateRegister: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),

        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    ],

    validateLogin: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],

    validateForgotPassword: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email')
    ],

    validateResetPassword: [
        body('token')
            .notEmpty()
            .withMessage('Reset token is required'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    ]
};
