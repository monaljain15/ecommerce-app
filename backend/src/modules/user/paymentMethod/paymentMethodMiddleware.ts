import { Request, Response, NextFunction } from 'express';
import { PaymentMethod } from '../../../models';
import { AppError } from '../../../middleware/errorHandler';

// Extend Request interface to include user and paymentMethod
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
    paymentMethod?: PaymentMethod;
}

// Middleware to check if payment method belongs to user
export const checkPaymentMethodOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const paymentMethodId = req.params.id;

        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const paymentMethod = await PaymentMethod.findOne({
            where: { id: paymentMethodId, userId }
        });

        if (!paymentMethod) {
            throw new AppError('Payment method not found or does not belong to user', 404);
        }

        // Attach payment method to request for use in controller
        (req as AuthenticatedRequest).paymentMethod = paymentMethod;
        next();
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to verify payment method ownership'
        });
    }
};

// Middleware to check if user can modify payment method
export const checkPaymentMethodModification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const paymentMethod = req.paymentMethod;

        if (!paymentMethod) {
            throw new AppError('Payment method not found', 404);
        }

        // Check if payment method is active
        if (!paymentMethod.isActive) {
            throw new AppError('Cannot modify inactive payment method', 400);
        }

        next();
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to verify payment method modification rights'
        });
    }
};

// Middleware to check payment method limits
export const checkPaymentMethodLimits = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const MAX_PAYMENT_METHODS = 10; // Maximum payment methods per user

        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        // Count existing payment methods
        const existingCount = await PaymentMethod.count({
            where: { userId, isActive: true }
        });

        if (existingCount >= MAX_PAYMENT_METHODS) {
            throw new AppError(`Maximum of ${MAX_PAYMENT_METHODS} payment methods allowed`, 400);
        }

        next();
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to check payment method limits'
        });
    }
};

// Middleware to validate card data before processing
export const validateCardData = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { cardNumber, expMonth, expYear, cvc } = req.body;

        // Basic card number validation
        if (cardNumber && !/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
            throw new AppError('Invalid card number format', 400);
        }

        // Expiry date validation
        if (expMonth && (expMonth < 1 || expMonth > 12)) {
            throw new AppError('Invalid expiry month', 400);
        }

        if (expYear && expYear < new Date().getFullYear()) {
            throw new AppError('Card has expired', 400);
        }

        // CVC validation
        if (cvc && !/^\d{3,4}$/.test(cvc)) {
            throw new AppError('Invalid CVC format', 400);
        }

        next();
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Invalid card data'
        });
    }
};

// Middleware to check if user has any payment methods
export const checkHasPaymentMethods = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        const paymentMethodCount = await PaymentMethod.count({
            where: { userId, isActive: true }
        });

        if (paymentMethodCount === 0) {
            throw new AppError('No payment methods found', 404);
        }

        next();
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to check payment methods'
        });
    }
};

// Middleware to ensure at least one default payment method
export const ensureDefaultPaymentMethod = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const paymentMethodId = req.params.id;

        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }

        // Check if this is the only default payment method
        const defaultCount = await PaymentMethod.count({
            where: { userId, isDefault: true, isActive: true }
        });

        const currentPaymentMethod = await PaymentMethod.findOne({
            where: { id: paymentMethodId, userId }
        });

        if (defaultCount === 1 && currentPaymentMethod?.isDefault) {
            throw new AppError('Cannot delete the only default payment method', 400);
        }

        next();
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to ensure default payment method'
        });
    }
};
