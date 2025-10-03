import Joi from 'joi';

// Create review schema
const createReviewSchema = Joi.object({
    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Product ID is required',
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        }),
    orderId: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Order ID must be a valid UUID'
        }),
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Rating must be a number',
            'number.integer': 'Rating must be an integer',
            'number.min': 'Rating must be 1 or greater',
            'number.max': 'Rating must be 5 or less',
            'any.required': 'Rating is required'
        }),
    title: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Title must be at least 3 characters long',
            'string.max': 'Title must not exceed 255 characters'
        }),
    comment: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.empty': 'Comment is required',
            'string.min': 'Comment must be at least 10 characters long',
            'string.max': 'Comment must not exceed 2000 characters',
            'any.required': 'Comment is required'
        })
});

// Update review schema
const updateReviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .optional()
        .messages({
            'number.base': 'Rating must be a number',
            'number.integer': 'Rating must be an integer',
            'number.min': 'Rating must be 1 or greater',
            'number.max': 'Rating must be 5 or less'
        }),
    title: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Title must be at least 3 characters long',
            'string.max': 'Title must not exceed 255 characters'
        }),
    comment: Joi.string()
        .min(10)
        .max(2000)
        .optional()
        .messages({
            'string.min': 'Comment must be at least 10 characters long',
            'string.max': 'Comment must not exceed 2000 characters'
        })
});

// Review query schema
const reviewQuerySchema = Joi.object({
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
    productId: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Product ID must be a valid UUID'
        }),
    userId: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'User ID must be a valid UUID'
        }),
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .optional()
        .messages({
            'number.base': 'Rating must be a number',
            'number.integer': 'Rating must be an integer',
            'number.min': 'Rating must be 1 or greater',
            'number.max': 'Rating must be 5 or less'
        }),
    isApproved: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is approved must be a boolean'
        }),
    isVerified: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is verified must be a boolean'
        }),
    sortBy: Joi.string()
        .valid('createdAt', 'updatedAt', 'rating', 'helpfulCount')
        .optional()
        .messages({
            'any.only': 'Sort by must be one of: createdAt, updatedAt, rating, helpfulCount'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .messages({
            'any.only': 'Sort order must be either asc or desc'
        })
});

// Review ID parameter schema
const reviewIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Review ID is required',
            'string.guid': 'Review ID must be a valid UUID',
            'any.required': 'Review ID is required'
        })
});

// Mark review as helpful schema
const markHelpfulSchema = Joi.object({
    helpful: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'Helpful must be a boolean',
            'any.required': 'Helpful is required'
        })
});

export {
    createReviewSchema,
    updateReviewSchema,
    reviewQuerySchema,
    reviewIdSchema,
    markHelpfulSchema
};
