import { User, Address } from '../../models';
import { AppError } from '../../middleware/errorHandler';
import { Op } from 'sequelize';

// Define explicit return types to avoid TypeScript export issues
interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    emailVerified: boolean;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AddressData {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
    type: 'shipping' | 'billing' | 'both';
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserStats {
    totalOrders: number;
    totalSpent: number;
    addresses: number;
    reviews: number;
    favorites: number;
}

interface PaginatedUsers {
    users: UserProfile[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get user profile
export async function getProfile(userId: string): Promise<UserProfile> {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || undefined,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin || undefined,
        createdAt: user.createdAt || undefined,
        updatedAt: user.updatedAt || undefined
    };
}

// Update user profile
export async function updateProfile(userId: string, updateData: any): Promise<UserProfile> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Update user data
    await user.update(updateData);

    // Return updated user without sensitive data
    const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!updatedUser) {
        throw new AppError('User not found after update', 404);
    }

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || undefined,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        emailVerified: updatedUser.emailVerified,
        lastLogin: updatedUser.lastLogin || undefined,
        createdAt: updatedUser.createdAt || undefined,
        updatedAt: updatedUser.updatedAt || undefined
    };
}

// Change user password
export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
        throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ password: hashedPassword });

    return true;
}

// Upload user avatar
export async function uploadAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    await user.update({ avatar: avatarUrl });

    // Return updated user without sensitive data
    const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!updatedUser) {
        throw new AppError('User not found after update', 404);
    }

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || undefined,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        emailVerified: updatedUser.emailVerified,
        lastLogin: updatedUser.lastLogin || undefined,
        createdAt: updatedUser.createdAt || undefined,
        updatedAt: updatedUser.updatedAt || undefined
    };
}

// Delete user avatar
export async function deleteAvatar(userId: string): Promise<UserProfile> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    await user.update({ avatar: undefined });

    // Return updated user without sensitive data
    const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!updatedUser) {
        throw new AppError('User not found after update', 404);
    }

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || undefined,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        emailVerified: updatedUser.emailVerified,
        lastLogin: updatedUser.lastLogin || undefined,
        createdAt: updatedUser.createdAt || undefined,
        updatedAt: updatedUser.updatedAt || undefined
    };
}

// Get user statistics
export async function getUserStats(userId: string): Promise<UserStats> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Get user's order count and total spent
    const { Order } = require('../../models');
    const orders = await Order.findAll({
        where: { userId },
        attributes: ['total']
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);

    // Get user's address count
    const addressCount = await Address.count({
        where: { userId }
    });

    // Get user's review count
    const { Review } = require('../../models');
    const reviewCount = await Review.count({
        where: { userId }
    });

    // Get user's favorite count
    const { Favorite } = require('../../models');
    const favoriteCount = await Favorite.count({
        where: { userId }
    });

    return {
        totalOrders,
        totalSpent,
        addresses: addressCount,
        reviews: reviewCount,
        favorites: favoriteCount
    };
}

// Get user addresses
export async function getAddresses(userId: string): Promise<AddressData[]> {
    const addresses = await Address.findAll({
        where: { userId },
        order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });

    return addresses.map(address => ({
        id: address.id,
        userId: address.userId,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || undefined,
        address1: address.address1,
        address2: address.address2 || undefined,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone || undefined,
        isDefault: address.isDefault,
        type: address.type,
        createdAt: address.createdAt || undefined,
        updatedAt: address.updatedAt || undefined
    }));
}

// Create user address
export async function createAddress(userId: string, addressData: any): Promise<AddressData> {
    const address = await Address.create({
        ...addressData,
        userId
    });

    return {
        id: address.id,
        userId: address.userId,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || undefined,
        address1: address.address1,
        address2: address.address2 || undefined,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone || undefined,
        isDefault: address.isDefault,
        type: address.type,
        createdAt: address.createdAt || undefined,
        updatedAt: address.updatedAt || undefined
    };
}

// Update user address
export async function updateAddress(userId: string, addressId: string, updateData: any): Promise<AddressData> {
    const address = await Address.findOne({
        where: { id: addressId, userId }
    });

    if (!address) {
        throw new AppError('Address not found', 404);
    }

    await address.update(updateData);

    return {
        id: address.id,
        userId: address.userId,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || undefined,
        address1: address.address1,
        address2: address.address2 || undefined,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone || undefined,
        isDefault: address.isDefault,
        type: address.type,
        createdAt: address.createdAt || undefined,
        updatedAt: address.updatedAt || undefined
    };
}

// Delete user address
export async function deleteAddress(userId: string, addressId: string): Promise<boolean> {
    const address = await Address.findOne({
        where: { id: addressId, userId }
    });

    if (!address) {
        throw new AppError('Address not found', 404);
    }

    await address.destroy();
    return true;
}

// Get all users (admin only)
export async function getAllUsers(queryParams: any): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, search, role, isActive, emailVerified, sortBy = 'createdAt', sortOrder = 'DESC' } = queryParams;

    const whereClause: any = {};

    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
        ];
    }

    if (role) {
        whereClause.role = role;
    }

    if (isActive !== undefined) {
        whereClause.isActive = isActive;
    }

    if (emailVerified !== undefined) {
        whereClause.emailVerified = emailVerified;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] },
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset
    });

    return {
        users: rows.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || undefined,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin || undefined,
            createdAt: user.createdAt || undefined,
            updatedAt: user.updatedAt || undefined
        })),
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
        }
    };
}

// Update user status (admin only)
export async function updateUserStatus(userId: string, isActive: boolean): Promise<UserProfile> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    await user.update({ isActive });

    // Return updated user without sensitive data
    const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!updatedUser) {
        throw new AppError('User not found after update', 404);
    }

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || undefined,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        emailVerified: updatedUser.emailVerified,
        lastLogin: updatedUser.lastLogin || undefined,
        createdAt: updatedUser.createdAt || undefined,
        updatedAt: updatedUser.updatedAt || undefined
    };
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: string): Promise<UserProfile> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    await user.update({ role: role as 'user' | 'admin' });

    // Return updated user without sensitive data
    const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!updatedUser) {
        throw new AppError('User not found after update', 404);
    }

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || undefined,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        emailVerified: updatedUser.emailVerified,
        lastLogin: updatedUser.lastLogin || undefined,
        createdAt: updatedUser.createdAt || undefined,
        updatedAt: updatedUser.updatedAt || undefined
    };
}

// Export all functions as a service object for backward compatibility
export const userService = {
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    deleteAvatar,
    getUserStats,
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAllUsers,
    updateUserStatus,
    updateUserRole
};