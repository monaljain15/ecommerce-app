import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, RefreshToken } from '../../models';
import { AppError } from '../../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
    async register(name: string, email: string, password: string) {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isActive: true,
            emailVerified: false
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
        );

        // Generate refresh token
        const refreshToken = await this.generateRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token,
            refreshToken
        };
    },

    async login(email: string, password: string) {
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError('Account is deactivated', 401);
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
        );

        // Generate refresh token
        const refreshToken = await this.generateRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token,
            refreshToken
        };
    },

    async logout(userId?: string) {
        if (userId) {
            // Revoke all refresh tokens for the user
            await RefreshToken.update(
                { isRevoked: true, revokedAt: new Date() },
                { where: { userId, isRevoked: false } }
            );
        }
        return true;
    },

    async forgotPassword(email: string) {
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { email, type: 'password-reset' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        // Store reset token in user record
        await user.update({
            passwordResetToken: resetToken,
            passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });

        // TODO: Send email with reset link
        // await emailService.sendPasswordResetEmail(email, resetToken);

        return true;
    },

    async resetPassword(token: string, password: string) {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

        if (decoded.type !== 'password-reset') {
            throw new AppError('Invalid token', 400);
        }

        // Find user with valid reset token
        const user = await User.findOne({
            where: {
                email: decoded.email,
                passwordResetToken: token,
                passwordResetExpires: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            throw new AppError('Invalid or expired token', 400);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password and clear reset token
        await user.update({
            password: hashedPassword,
            passwordResetToken: undefined,
            passwordResetExpires: undefined
        });

        return true;
    },

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new AppError('Current password is incorrect', 400);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await user.update({ password: hashedPassword });

        return true;
    },

    async verifyEmail(token: string) {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

        if (decoded.type !== 'email-verification') {
            throw new AppError('Invalid token', 400);
        }

        // Find user
        const user = await User.findOne({
            where: {
                email: decoded.email,
                emailVerificationToken: token
            }
        });

        if (!user) {
            throw new AppError('Invalid token', 400);
        }

        // Update user
        await user.update({
            emailVerified: true,
            emailVerificationToken: undefined
        });

        return true;
    },

    async refreshToken(refreshToken: string) {
        // Find refresh token
        const tokenRecord = await RefreshToken.findOne({
            where: {
                token: refreshToken,
                isRevoked: false,
                expiresAt: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        });

        if (!tokenRecord) {
            throw new AppError('Invalid or expired refresh token', 401);
        }

        // Find user
        const user = await User.findByPk(tokenRecord.userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Generate new JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
        );

        // Generate new refresh token
        const newRefreshToken = await this.generateRefreshToken(user.id);

        // Revoke old refresh token
        await tokenRecord.update({ isRevoked: true, revokedAt: new Date() });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token,
            refreshToken: newRefreshToken
        };
    },

    async generateRefreshToken(userId: string): Promise<string> {
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await RefreshToken.create({
            userId,
            token,
            expiresAt
        });

        return token;
    }
};
