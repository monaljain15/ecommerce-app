import * as Joi from 'joi';

// Schema for creating a payment method
export const createPaymentMethodSchema = Joi.object({
    type: Joi.string().valid('card', 'bank_account').required(),
    cardNumber: Joi.string()
        .pattern(/^\d{13,19}$/)
        .required()
        .messages({
            'string.pattern.base': 'Card number must be between 13 and 19 digits'
        }),
    expMonth: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required()
        .messages({
            'number.min': 'Expiry month must be between 1 and 12',
            'number.max': 'Expiry month must be between 1 and 12'
        }),
    expYear: Joi.number()
        .integer()
        .min(new Date().getFullYear())
        .required()
        .messages({
            'number.min': 'Card has expired'
        }),
    cvc: Joi.string()
        .pattern(/^\d{3,4}$/)
        .required()
        .messages({
            'string.pattern.base': 'CVC must be 3 or 4 digits'
        }),
    name: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.min': 'Cardholder name is required',
            'string.max': 'Cardholder name must be less than 255 characters'
        }),
    isDefault: Joi.boolean().optional()
});

// Schema for updating a payment method
export const updatePaymentMethodSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Cardholder name cannot be empty',
            'string.max': 'Cardholder name must be less than 255 characters'
        }),
    isDefault: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
});

// Schema for payment method ID parameter
export const paymentMethodIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Invalid payment method ID format'
        })
});

// Schema for setting default payment method
export const setDefaultPaymentMethodSchema = Joi.object({
    isDefault: Joi.boolean()
        .valid(true)
        .required()
        .messages({
            'any.only': 'isDefault must be true'
        })
});

// Schema for payment method query parameters
export const paymentMethodQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    type: Joi.string().valid('card', 'bank_account').optional(),
    isActive: Joi.boolean().optional(),
    isDefault: Joi.boolean().optional(),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'type').optional().default('createdAt'),
    sortOrder: Joi.string().valid('ASC', 'DESC').optional().default('DESC')
});

// Schema for Stripe payment method creation
export const stripePaymentMethodSchema = Joi.object({
    type: Joi.string().valid('card').required(),
    card: Joi.object({
        number: Joi.string()
            .pattern(/^\d{13,19}$/)
            .required(),
        exp_month: Joi.number()
            .integer()
            .min(1)
            .max(12)
            .required(),
        exp_year: Joi.number()
            .integer()
            .min(new Date().getFullYear())
            .required(),
        cvc: Joi.string()
            .pattern(/^\d{3,4}$/)
            .required()
    }).required(),
    billing_details: Joi.object({
        name: Joi.string()
            .min(1)
            .max(255)
            .required()
    }).required()
});

// All schemas are already exported above
