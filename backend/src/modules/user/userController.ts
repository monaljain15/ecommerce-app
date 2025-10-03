import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../types';
import { userService } from './userService';
const multer = require('multer');
import s3Service from '../../services/s3Service';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
        }
    },
});

// Export multer middleware for use in routes
export const uploadAvatarMiddleware = upload.single('avatar');

// Error handling middleware for multer
export const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    } else if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
};

export const userController = {
    // @route   GET /api/users/profile
    // @desc    Get user profile
    // @access  Private
    async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const profile = await userService.getProfile(userId);

            res.json({
                success: true,
                data: profile
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   PUT /api/users/profile
    // @desc    Update user profile
    // @access  Private
    async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const updateData = req.body;
            const updatedProfile = await userService.updateProfile(userId, updateData);

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedProfile
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/users/change-password
    // @desc    Change user password
    // @access  Private
    async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { currentPassword, newPassword } = req.body;
            await userService.changePassword(userId, currentPassword, newPassword);

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/users/avatar
    // @desc    Upload user avatar
    // @access  Private
    async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Upload file to S3
            const avatarUrl = await s3Service.uploadFileToS3(req.file, userId);

            // Update user profile with S3 URL
            const updatedProfile = await userService.uploadAvatar(userId, avatarUrl);

            res.json({
                success: true,
                message: 'Avatar uploaded successfully',
                data: updatedProfile
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   DELETE /api/users/avatar
    // @desc    Delete user avatar
    // @access  Private
    async deleteAvatar(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            // Get current user to check for existing avatar
            const currentUser = await userService.getProfile(userId);

            // Delete from S3 if avatar exists and is from S3
            if (currentUser.avatar && s3Service.isS3Url(currentUser.avatar)) {
                const s3Key = s3Service.extractS3KeyFromUrl(currentUser.avatar);
                if (s3Key) {
                    await s3Service.deleteFileFromS3(s3Key);
                }
            }

            const updatedProfile = await userService.deleteAvatar(userId);

            res.json({
                success: true,
                message: 'Avatar deleted successfully',
                data: updatedProfile
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/users/avatar/upload-url
    // @desc    Get S3 presigned URL for direct upload
    // @access  Private
    async getS3UploadUrl(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { fileName, fileType } = req.body;
            if (!fileName || !fileType) {
                return res.status(400).json({
                    success: false,
                    message: 'File name and type are required'
                });
            }

            const uploadData = await s3Service.generatePresignedUploadUrl(fileName, fileType, userId);

            res.json({
                success: true,
                message: 'Upload URL generated successfully',
                data: uploadData
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/users/avatar/confirm-upload
    // @desc    Confirm S3 upload completion
    // @access  Private
    async confirmS3Upload(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { key } = req.body;
            if (!key) {
                return res.status(400).json({
                    success: false,
                    message: 'File key is required'
                });
            }

            // Confirm file upload and get public URL
            const avatarUrl = await s3Service.confirmFileUpload(key);

            // Update user profile with S3 URL
            const updatedProfile = await userService.uploadAvatar(userId, avatarUrl);

            res.json({
                success: true,
                message: 'Avatar upload confirmed successfully',
                data: updatedProfile
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   GET /api/users/avatar/signed-url
    // @desc    Get signed URL for avatar access
    // @access  Private
    async getAvatarSignedUrl(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { url } = req.query;
            if (!url || typeof url !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Avatar URL is required'
                });
            }

            // Check if it's an S3 URL
            if (!s3Service.isS3Url(url)) {
                return res.json({
                    success: true,
                    data: {
                        signedUrl: url, // Return original URL if not S3
                        expiresIn: null
                    }
                });
            }

            // Extract S3 key and generate signed URL
            const s3Key = s3Service.extractS3KeyFromUrl(url);
            if (!s3Key) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid S3 URL'
                });
            }

            const signedUrl = await s3Service.generateSignedUrl(s3Key, 3600); // 1 hour expiry

            res.json({
                success: true,
                data: {
                    signedUrl,
                    expiresIn: 3600
                }
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   GET /api/users/stats
    // @desc    Get user statistics
    // @access  Private
    async getUserStats(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const stats = await userService.getUserStats(userId);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   GET /api/users/addresses
    // @desc    Get user addresses
    // @access  Private
    async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const addresses = await userService.getAddresses(userId);

            res.json({
                success: true,
                data: addresses
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   POST /api/users/addresses
    // @desc    Create user address
    // @access  Private
    async createAddress(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const addressData = req.body;
            const address = await userService.createAddress(userId, addressData);

            res.status(201).json({
                success: true,
                message: 'Address created successfully',
                data: address
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   PUT /api/users/addresses/:id
    // @desc    Update user address
    // @access  Private
    async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            const { id } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const addressData = req.body;
            const address = await userService.updateAddress(userId, id, addressData);

            res.json({
                success: true,
                message: 'Address updated successfully',
                data: address
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   DELETE /api/users/addresses/:id
    // @desc    Delete user address
    // @access  Private
    async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            await userService.deleteAddress(userId, id);

            res.json({
                success: true,
                message: 'Address deleted successfully'
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   GET /api/users
    // @desc    Get all users (Admin only)
    // @access  Private/Admin
    async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const role = req.query.role as string;
            const isActive = req.query.isActive as string;

            const result = await userService.getAllUsers({
                page,
                limit,
                search,
                role,
                isActive: isActive ? isActive === 'true' : undefined
            });

            res.json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   PUT /api/users/:id/status
    // @desc    Update user status (Admin only)
    // @access  Private/Admin
    async updateUserStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            const updatedUser = await userService.updateUserStatus(id, isActive);

            res.json({
                success: true,
                message: 'User status updated successfully',
                data: updatedUser
            });
        } catch (error) {
            return next(error);
        }
    },

    // @route   PUT /api/users/:id/role
    // @desc    Update user role (Admin only)
    // @access  Private/Admin
    async updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const updatedUser = await userService.updateUserRole(id, role);

            res.json({
                success: true,
                message: 'User role updated successfully',
                data: updatedUser
            });
        } catch (error) {
            return next(error);
        }
    }
};
