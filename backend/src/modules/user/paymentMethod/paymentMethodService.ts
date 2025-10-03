import { PaymentMethod, User } from '../../../models';
import { AppError } from '../../../middleware/errorHandler';
import { Op } from 'sequelize';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// Define explicit return types to avoid TypeScript export issues
interface PaymentMethodData {
    id: string;
    userId: string;
    stripePaymentMethodId: string;
    type: 'card' | 'bank_account';
    last4: string;
    brand?: string;
    expMonth?: number;
    expYear?: number;
    name?: string;
    isDefault: boolean;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PaginatedPaymentMethods {
    paymentMethods: PaymentMethodData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get all payment methods for a user
export async function getPaymentMethods(userId: string, queryParams: any): Promise<PaginatedPaymentMethods> {
    const { page = 1, limit = 10, type, isActive, isDefault, sortBy = 'createdAt', sortOrder = 'DESC' } = queryParams;

    const whereClause: any = { userId };

    if (type) {
        whereClause.type = type;
    }

    if (isActive !== undefined) {
        whereClause.isActive = isActive;
    }

    if (isDefault !== undefined) {
        whereClause.isDefault = isDefault;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await PaymentMethod.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset,
    });

    return {
        paymentMethods: rows.map(pm => ({
            id: pm.id,
            userId: pm.userId,
            stripePaymentMethodId: pm.stripePaymentMethodId,
            type: pm.type,
            last4: pm.last4,
            brand: pm.brand || undefined,
            expMonth: pm.expMonth || undefined,
            expYear: pm.expYear || undefined,
            name: pm.name || undefined,
            isDefault: pm.isDefault,
            isActive: pm.isActive,
            metadata: pm.metadata || undefined,
            createdAt: pm.createdAt || undefined,
            updatedAt: pm.updatedAt || undefined
        })),
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
        }
    };
}

// Get a single payment method
export async function getPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethodData> {
    const paymentMethod = await PaymentMethod.findOne({
        where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) {
        throw new AppError('Payment method not found', 404);
    }

    return {
        id: paymentMethod.id,
        userId: paymentMethod.userId,
        stripePaymentMethodId: paymentMethod.stripePaymentMethodId,
        type: paymentMethod.type,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand || undefined,
        expMonth: paymentMethod.expMonth || undefined,
        expYear: paymentMethod.expYear || undefined,
        name: paymentMethod.name || undefined,
        isDefault: paymentMethod.isDefault,
        isActive: paymentMethod.isActive,
        metadata: paymentMethod.metadata || undefined,
        createdAt: paymentMethod.createdAt || undefined,
        updatedAt: paymentMethod.updatedAt || undefined
    };
}

// Create a new payment method
export async function createPaymentMethod(userId: string, paymentMethodData: any): Promise<PaymentMethodData> {
    const { type, cardNumber, expMonth, expYear, cvc, name: cardholderName, isDefault = false } = paymentMethodData;

    try {
        // Create Stripe customer if doesn't exist
        let stripeCustomerId = await getOrCreateStripeCustomer(userId);

        // Create Stripe payment method
        const stripePaymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            },
            billing_details: {
                name: cardholderName,
            },
        });

        // Attach payment method to customer
        await stripe.paymentMethods.attach(stripePaymentMethod.id, {
            customer: stripeCustomerId,
        });

        // If this is set as default, unset other defaults
        if (isDefault) {
            await PaymentMethod.update(
                { isDefault: false },
                { where: { userId, isDefault: true } }
            );
        }

        // Create payment method in database
        const paymentMethodData: any = {
            userId,
            stripePaymentMethodId: stripePaymentMethod.id,
            type: 'card',
            last4: stripePaymentMethod.card?.last4 || '',
            brand: stripePaymentMethod.card?.brand,
            expMonth: stripePaymentMethod.card?.exp_month,
            expYear: stripePaymentMethod.card?.exp_year,
            isDefault,
            isActive: true,
            metadata: {
                stripeCustomerId,
                createdVia: 'user_profile'
            }
        };

        // Add name property using bracket notation to avoid reserved keyword issues
        paymentMethodData['name'] = stripePaymentMethod.billing_details?.name || cardholderName;

        const paymentMethod = await PaymentMethod.create(paymentMethodData);

        return {
            id: paymentMethod.id,
            userId: paymentMethod.userId,
            stripePaymentMethodId: paymentMethod.stripePaymentMethodId,
            type: paymentMethod.type,
            last4: paymentMethod.last4,
            brand: paymentMethod.brand || undefined,
            expMonth: paymentMethod.expMonth || undefined,
            expYear: paymentMethod.expYear || undefined,
            name: paymentMethod.name || undefined,
            isDefault: paymentMethod.isDefault,
            isActive: paymentMethod.isActive,
            metadata: paymentMethod.metadata || undefined,
            createdAt: paymentMethod.createdAt || undefined,
            updatedAt: paymentMethod.updatedAt || undefined
        };
    } catch (error: any) {
        if (error.type === 'StripeCardError') {
            throw new AppError(`Card error: ${error.message}`, 400);
        } else if (error.type === 'StripeInvalidRequestError') {
            throw new AppError(`Invalid request: ${error.message}`, 400);
        } else {
            throw new AppError('Failed to create payment method', 500);
        }
    }
}

// Update a payment method
export async function updatePaymentMethod(userId: string, paymentMethodId: string, updateData: any): Promise<PaymentMethodData> {
    const paymentMethod = await PaymentMethod.findOne({
        where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) {
        throw new AppError('Payment method not found', 404);
    }

    // If setting as default, unset other defaults
    if (updateData.isDefault) {
        await PaymentMethod.update(
            { isDefault: false },
            { where: { userId, isDefault: true, id: { [Op.ne]: paymentMethodId } } }
        );
    }

    // Update payment method
    await paymentMethod.update(updateData);

    // Update Stripe payment method if name changed
    if (updateData.name) {
        try {
            await stripe.paymentMethods.update(paymentMethod.stripePaymentMethodId, {
                billing_details: {
                    name: updateData.name,
                },
            });
        } catch (error) {
            console.error('Failed to update Stripe payment method:', error);
        }
    }

    return {
        id: paymentMethod.id,
        userId: paymentMethod.userId,
        stripePaymentMethodId: paymentMethod.stripePaymentMethodId,
        type: paymentMethod.type,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand || undefined,
        expMonth: paymentMethod.expMonth || undefined,
        expYear: paymentMethod.expYear || undefined,
        name: paymentMethod.name || undefined,
        isDefault: paymentMethod.isDefault,
        isActive: paymentMethod.isActive,
        metadata: paymentMethod.metadata || undefined,
        createdAt: paymentMethod.createdAt || undefined,
        updatedAt: paymentMethod.updatedAt || undefined
    };
}

// Delete a payment method
export async function deletePaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
    const paymentMethod = await PaymentMethod.findOne({
        where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) {
        throw new AppError('Payment method not found', 404);
    }

    try {
        // Detach from Stripe customer
        await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);
    } catch (error) {
        console.error('Failed to detach Stripe payment method:', error);
        // Continue with deletion even if Stripe fails
    }

    // Delete from database
    await paymentMethod.destroy();

    return true;
}

// Set default payment method
export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethodData> {
    const paymentMethod = await PaymentMethod.findOne({
        where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) {
        throw new AppError('Payment method not found', 404);
    }

    // Unset all other defaults
    await PaymentMethod.update(
        { isDefault: false },
        { where: { userId, isDefault: true } }
    );

    // Set this one as default
    await paymentMethod.update({ isDefault: true });

    return {
        id: paymentMethod.id,
        userId: paymentMethod.userId,
        stripePaymentMethodId: paymentMethod.stripePaymentMethodId,
        type: paymentMethod.type,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand || undefined,
        expMonth: paymentMethod.expMonth || undefined,
        expYear: paymentMethod.expYear || undefined,
        name: paymentMethod.name || undefined,
        isDefault: paymentMethod.isDefault,
        isActive: paymentMethod.isActive,
        metadata: paymentMethod.metadata || undefined,
        createdAt: paymentMethod.createdAt || undefined,
        updatedAt: paymentMethod.updatedAt || undefined
    };
}

// Helper function to get or create Stripe customer
async function getOrCreateStripeCustomer(userId: string): Promise<string> {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Check if user already has a Stripe customer ID
    if (user.metadata?.stripeCustomerId) {
        return user.metadata.stripeCustomerId;
    }

    // Create new Stripe customer
    const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
            userId: userId,
        },
    });

    // Update user with Stripe customer ID
    await user.update({
        metadata: {
            ...user.metadata,
            stripeCustomerId: stripeCustomer.id,
        },
    });

    return stripeCustomer.id;
}

// Export all functions as a service object for backward compatibility
export const paymentMethodService = {
    getPaymentMethods,
    getPaymentMethod,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
};
