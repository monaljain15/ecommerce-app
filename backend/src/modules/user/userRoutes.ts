import express from 'express';
import { userController, uploadAvatarMiddleware, handleMulterError } from './userController';
import { authMiddleware } from '../auth/authMiddleware';
import paymentMethodRoutes from './paymentMethod/paymentMethodRoutes';
import {
    updateProfileSchema,
    changePasswordSchema,
    updateUserStatusSchema,
    updateUserRoleSchema,
    addressSchema,
    addressIdSchema
} from '../../schemas/userSchemas';

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

const validateParams = (schema: any) => {
    return (req: any, res: any, next: any) => {
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

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware.authenticate, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',
    authMiddleware.authenticate,
    validateRequest(updateProfileSchema),
    userController.updateProfile
);

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password',
    authMiddleware.authenticate,
    validateRequest(changePasswordSchema),
    userController.changePassword
);

// @route   POST /api/users/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar',
    authMiddleware.authenticate,
    uploadAvatarMiddleware,
    handleMulterError,
    userController.uploadAvatar
);

// @route   DELETE /api/users/avatar
// @desc    Delete user avatar
// @access  Private
router.delete('/avatar',
    authMiddleware.authenticate,
    userController.deleteAvatar
);

// @route   POST /api/users/avatar/upload-url
// @desc    Get S3 presigned URL for direct upload
// @access  Private
router.post('/avatar/upload-url',
    authMiddleware.authenticate,
    userController.getS3UploadUrl
);

// @route   POST /api/users/avatar/confirm-upload
// @desc    Confirm S3 upload completion
// @access  Private
router.post('/avatar/confirm-upload',
    authMiddleware.authenticate,
    userController.confirmS3Upload
);

// @route   GET /api/users/avatar/signed-url
// @desc    Get signed URL for avatar access
// @access  Private
router.get('/avatar/signed-url',
    authMiddleware.authenticate,
    userController.getAvatarSignedUrl
);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats',
    authMiddleware.authenticate,
    userController.getUserStats
);

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses',
    authMiddleware.authenticate,
    userController.getAddresses
);

// @route   POST /api/users/addresses
// @desc    Create user address
// @access  Private
router.post('/addresses',
    authMiddleware.authenticate,
    validateRequest(addressSchema),
    userController.createAddress
);

// @route   PUT /api/users/addresses/:id
// @desc    Update user address
// @access  Private
router.put('/addresses/:id',
    authMiddleware.authenticate,
    validateParams(addressIdSchema),
    validateRequest(addressSchema),
    userController.updateAddress
);

// @route   DELETE /api/users/addresses/:id
// @desc    Delete user address
// @access  Private
router.delete('/addresses/:id',
    authMiddleware.authenticate,
    validateParams(addressIdSchema),
    userController.deleteAddress
);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/',
    authMiddleware.authenticate,
    authMiddleware.authorize('admin'),
    userController.getAllUsers
);

// @route   PUT /api/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private/Admin
router.put('/:id/status',
    authMiddleware.authenticate,
    authMiddleware.authorize('admin'),
    validateParams(addressIdSchema),
    validateRequest(updateUserStatusSchema),
    userController.updateUserStatus
);

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put('/:id/role',
    authMiddleware.authenticate,
    authMiddleware.authorize('admin'),
    validateParams(addressIdSchema),
    validateRequest(updateUserRoleSchema),
    userController.updateUserRole
);

// Payment Methods Routes
// Mount payment method routes under /users/payment-methods
router.use('/payment-methods', paymentMethodRoutes);

export default router;
