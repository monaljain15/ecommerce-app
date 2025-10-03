import { body, param } from 'express-validator';

export const userValidator = {
    validateUpdateProfile: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),

        body('email')
            .optional()
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email')
    ],

    validateChangePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),

        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),

        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match new password');
                }
                return true;
            })
    ],

    validateUpdateStatus: [
        param('id')
            .isUUID()
            .withMessage('Invalid user ID'),

        body('isActive')
            .isBoolean()
            .withMessage('isActive must be a boolean value')
    ]
};
