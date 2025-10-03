import Joi from 'joi';

// Order item schema
const orderItemSchema = Joi.object({
    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Product ID is required',
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        }),
    name: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name must be at least 1 character long',
            'string.max': 'Product name must not exceed 255 characters',
            'any.required': 'Product name is required'
        }),
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be positive',
            'any.required': 'Price is required'
        }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be 1 or greater',
            'any.required': 'Quantity is required'
        }),
    image: Joi.string()
        .uri()
        .required()
        .messages({
            'string.empty': 'Product image is required',
            'string.uri': 'Product image must be a valid URL',
            'any.required': 'Product image is required'
        })
});

// Address schema
const addressSchema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 1 character long',
            'string.max': 'First name must not exceed 50 characters',
            'any.required': 'First name is required'
        }),
    lastName: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 1 character long',
            'string.max': 'Last name must not exceed 50 characters',
            'any.required': 'Last name is required'
        }),
    company: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Company name must not exceed 100 characters'
        }),
    address1: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Address line 1 is required',
            'string.min': 'Address line 1 must be at least 1 character long',
            'string.max': 'Address line 1 must not exceed 255 characters',
            'any.required': 'Address line 1 is required'
        }),
    address2: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'Address line 2 must not exceed 255 characters'
        }),
    city: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'City is required',
            'string.min': 'City must be at least 1 character long',
            'string.max': 'City must not exceed 100 characters',
            'any.required': 'City is required'
        }),
    state: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'State is required',
            'string.min': 'State must be at least 1 character long',
            'string.max': 'State must not exceed 100 characters',
            'any.required': 'State is required'
        }),
    zipCode: Joi.string()
        .min(1)
        .max(20)
        .required()
        .messages({
            'string.empty': 'ZIP code is required',
            'string.min': 'ZIP code must be at least 1 character long',
            'string.max': 'ZIP code must not exceed 20 characters',
            'any.required': 'ZIP code is required'
        }),
    country: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Country is required',
            'string.min': 'Country must be at least 1 character long',
            'string.max': 'Country must not exceed 100 characters',
            'any.required': 'Country is required'
        }),
    phone: Joi.string()
        .min(10)
        .max(20)
        .optional()
        .messages({
            'string.min': 'Phone number must be at least 10 characters long',
            'string.max': 'Phone number must not exceed 20 characters'
        })
});

// Create order schema
const createOrderSchema = Joi.object({
    items: Joi.array()
        .items(orderItemSchema)
        .min(1)
        .required()
        .messages({
            'array.base': 'Items must be an array',
            'array.min': 'At least one item is required',
            'any.required': 'Items are required'
        }),
    subtotal: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'Subtotal must be a number',
            'number.positive': 'Subtotal must be positive',
            'any.required': 'Subtotal is required'
        }),
    shipping: Joi.number()
        .min(0)
        .precision(2)
        .required()
        .messages({
            'number.base': 'Shipping must be a number',
            'number.min': 'Shipping must be 0 or greater',
            'any.required': 'Shipping is required'
        }),
    tax: Joi.number()
        .min(0)
        .precision(2)
        .required()
        .messages({
            'number.base': 'Tax must be a number',
            'number.min': 'Tax must be 0 or greater',
            'any.required': 'Tax is required'
        }),
    total: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'Total must be a number',
            'number.positive': 'Total must be positive',
            'any.required': 'Total is required'
        }),
    shippingAddress: addressSchema.required().messages({
        'any.required': 'Shipping address is required'
    }),
    billingAddress: addressSchema.required().messages({
        'any.required': 'Billing address is required'
    }),
    paymentMethodId: Joi.string()
        .required()
        .messages({
            'string.empty': 'Payment method ID is required',
            'any.required': 'Payment method ID is required'
        }),
    notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Notes must not exceed 1000 characters'
        })
});

// Update order status schema
const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled',
            'any.required': 'Status is required'
        }),
    trackingNumber: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Tracking number must not exceed 100 characters'
        }),
    estimatedDelivery: Joi.date()
        .optional()
        .messages({
            'date.base': 'Estimated delivery must be a valid date'
        }),
    notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Notes must not exceed 1000 characters'
        })
});

// Order query schema
const orderQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be 1 or greater'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be 1 or greater',
            'number.max': 'Limit must not exceed 100'
        }),
    status: Joi.string()
        .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        .optional()
        .messages({
            'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled'
        }),
    sortBy: Joi.string()
        .valid('createdAt', 'updatedAt', 'total', 'status')
        .optional()
        .messages({
            'any.only': 'Sort by must be one of: createdAt, updatedAt, total, status'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .messages({
            'any.only': 'Sort order must be either asc or desc'
        }),
    startDate: Joi.date()
        .optional()
        .messages({
            'date.base': 'Start date must be a valid date'
        }),
    endDate: Joi.date()
        .min(Joi.ref('startDate'))
        .optional()
        .messages({
            'date.base': 'End date must be a valid date',
            'date.min': 'End date must be after start date'
        })
});

// Order ID parameter schema
const orderIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Order ID is required',
            'string.guid': 'Order ID must be a valid UUID',
            'any.required': 'Order ID is required'
        })
});

export {
    createOrderSchema,
    updateOrderStatusSchema,
    orderQuerySchema,
    orderIdSchema,
    orderItemSchema,
    addressSchema
};
