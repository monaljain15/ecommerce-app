import { Request, Response } from 'express';
import { paymentMethodService } from './paymentMethodService';
import { AppError } from '../../../middleware/errorHandler';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

// Get all payment methods for a user
export const getPaymentMethods = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const paymentMethods = await paymentMethodService.getPaymentMethods(userId, req.query);

        res.status(200).json({
            success: true,
            data: paymentMethods
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to get payment methods'
        });
    }
};

// Get a single payment method
export const getPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const { id } = req.params;
        const paymentMethod = await paymentMethodService.getPaymentMethod(userId, id);

        res.status(200).json({
            success: true,
            data: paymentMethod
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to get payment method'
        });
    }
};

// Create a new payment method
export const createPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const paymentMethodData = req.body;
        const paymentMethod = await paymentMethodService.createPaymentMethod(userId, paymentMethodData);

        res.status(201).json({
            success: true,
            message: 'Payment method created successfully',
            data: paymentMethod
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to create payment method'
        });
    }
};

// Update a payment method
export const updatePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const { id } = req.params;
        const updateData = req.body;
        const paymentMethod = await paymentMethodService.updatePaymentMethod(userId, id, updateData);

        res.status(200).json({
            success: true,
            message: 'Payment method updated successfully',
            data: paymentMethod
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to update payment method'
        });
    }
};

// Delete a payment method
export const deletePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const { id } = req.params;
        await paymentMethodService.deletePaymentMethod(userId, id);

        res.status(200).json({
            success: true,
            message: 'Payment method deleted successfully'
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to delete payment method'
        });
    }
};

// Set default payment method
export const setDefaultPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const { id } = req.params;
        const paymentMethod = await paymentMethodService.setDefaultPaymentMethod(userId, id);

        res.status(200).json({
            success: true,
            message: 'Default payment method updated successfully',
            data: paymentMethod
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to set default payment method'
        });
    }
};

// Get payment method statistics
export const getPaymentMethodStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const { pagination: totalMethods } = await paymentMethodService.getPaymentMethods(userId, { limit: 1 });
        const { pagination: activeMethods } = await paymentMethodService.getPaymentMethods(userId, { limit: 1, isActive: true });
        const { pagination: defaultMethods } = await paymentMethodService.getPaymentMethods(userId, { limit: 1, isDefault: true });
        const { pagination: cardMethods } = await paymentMethodService.getPaymentMethods(userId, { limit: 1, type: 'card' });

        res.status(200).json({
            success: true,
            data: {
                totalMethods: totalMethods.total,
                activeMethods: activeMethods.total,
                defaultMethods: defaultMethods.total,
                cardMethods: cardMethods.total,
                bankAccountMethods: totalMethods.total - cardMethods.total
            }
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to get payment method statistics'
        });
    }
};
