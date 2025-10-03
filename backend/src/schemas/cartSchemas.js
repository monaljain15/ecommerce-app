const Joi = require('joi');

// Add to cart schema
const addToCartSchema = Joi.object({
    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Product ID is required',
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .default(1)
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be 1 or greater',
            'number.max': 'Quantity must not exceed 100'
        })
});

// Update cart item quantity schema
const updateCartItemSchema = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be 0 or greater',
            'number.max': 'Quantity must not exceed 100',
            'any.required': 'Quantity is required'
        })
});

// Cart item ID parameter schema
const cartItemIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Cart item ID is required',
            'string.guid': 'Cart item ID must be a valid UUID',
            'any.required': 'Cart item ID is required'
        })
});

// Bulk update cart schema
const bulkUpdateCartSchema = Joi.object({
    items: Joi.array()
        .items(Joi.object({
            id: Joi.string()
                .uuid()
                .required()
                .messages({
                    'string.empty': 'Cart item ID is required',
                    'string.guid': 'Cart item ID must be a valid UUID',
                    'any.required': 'Cart item ID is required'
                }),
            quantity: Joi.number()
                .integer()
                .min(0)
                .max(100)
                .required()
                .messages({
                    'number.base': 'Quantity must be a number',
                    'number.integer': 'Quantity must be an integer',
                    'number.min': 'Quantity must be 0 or greater',
                    'number.max': 'Quantity must not exceed 100',
                    'any.required': 'Quantity is required'
                })
        }))
        .min(1)
        .required()
        .messages({
            'array.base': 'Items must be an array',
            'array.min': 'At least one item is required',
            'any.required': 'Items are required'
        })
});

module.exports = {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdSchema,
    bulkUpdateCartSchema
};
