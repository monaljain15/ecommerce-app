const Joi = require('joi');

// Product creation schema
const createProductSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name must be at least 2 characters long',
            'string.max': 'Product name must not exceed 255 characters',
            'any.required': 'Product name is required'
        }),
    slug: Joi.string()
        .min(2)
        .max(255)
        .pattern(/^[a-z0-9-]+$/)
        .required()
        .messages({
            'string.empty': 'Product slug is required',
            'string.min': 'Product slug must be at least 2 characters long',
            'string.max': 'Product slug must not exceed 255 characters',
            'string.pattern.base': 'Product slug can only contain lowercase letters, numbers, and hyphens',
            'any.required': 'Product slug is required'
        }),
    description: Joi.string()
        .min(10)
        .required()
        .messages({
            'string.empty': 'Product description is required',
            'string.min': 'Product description must be at least 10 characters long',
            'any.required': 'Product description is required'
        }),
    shortDescription: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Short description must not exceed 500 characters'
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
    comparePrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Compare price must be a number',
            'number.positive': 'Compare price must be positive'
        }),
    costPrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Cost price must be a number',
            'number.positive': 'Cost price must be positive'
        }),
    sku: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'SKU must not exceed 100 characters'
        }),
    barcode: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Barcode must not exceed 100 characters'
        }),
    image: Joi.string()
        .uri()
        .required()
        .messages({
            'string.empty': 'Product image is required',
            'string.uri': 'Product image must be a valid URL',
            'any.required': 'Product image is required'
        }),
    images: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .messages({
            'array.base': 'Images must be an array',
            'string.uri': 'Each image must be a valid URL'
        }),
    categoryId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Category ID is required',
            'string.guid': 'Category ID must be a valid UUID',
            'any.required': 'Category ID is required'
        }),
    brandId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Brand ID is required',
            'string.guid': 'Brand ID must be a valid UUID',
            'any.required': 'Brand ID is required'
        }),
    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Stock must be a number',
            'number.integer': 'Stock must be an integer',
            'number.min': 'Stock must be 0 or greater',
            'any.required': 'Stock is required'
        }),
    lowStockThreshold: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'Low stock threshold must be a number',
            'number.integer': 'Low stock threshold must be an integer',
            'number.min': 'Low stock threshold must be 0 or greater'
        }),
    weight: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Weight must be a number',
            'number.positive': 'Weight must be positive'
        }),
    dimensions: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Dimensions must not exceed 100 characters'
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is active must be a boolean'
        }),
    isDigital: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is digital must be a boolean'
        }),
    isFeatured: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is featured must be a boolean'
        }),
    metaTitle: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'Meta title must not exceed 255 characters'
        }),
    metaDescription: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Meta description must not exceed 500 characters'
        }),
    tags: Joi.array()
        .items(Joi.string().max(50))
        .optional()
        .messages({
            'array.base': 'Tags must be an array',
            'string.max': 'Each tag must not exceed 50 characters'
        })
});

// Product update schema
const updateProductSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Product name must be at least 2 characters long',
            'string.max': 'Product name must not exceed 255 characters'
        }),
    slug: Joi.string()
        .min(2)
        .max(255)
        .pattern(/^[a-z0-9-]+$/)
        .optional()
        .messages({
            'string.min': 'Product slug must be at least 2 characters long',
            'string.max': 'Product slug must not exceed 255 characters',
            'string.pattern.base': 'Product slug can only contain lowercase letters, numbers, and hyphens'
        }),
    description: Joi.string()
        .min(10)
        .optional()
        .messages({
            'string.min': 'Product description must be at least 10 characters long'
        }),
    shortDescription: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Short description must not exceed 500 characters'
        }),
    price: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be positive'
        }),
    comparePrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Compare price must be a number',
            'number.positive': 'Compare price must be positive'
        }),
    costPrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Cost price must be a number',
            'number.positive': 'Cost price must be positive'
        }),
    sku: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'SKU must not exceed 100 characters'
        }),
    barcode: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Barcode must not exceed 100 characters'
        }),
    image: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.uri': 'Product image must be a valid URL'
        }),
    images: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .messages({
            'array.base': 'Images must be an array',
            'string.uri': 'Each image must be a valid URL'
        }),
    categoryId: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Category ID must be a valid UUID'
        }),
    brandId: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Brand ID must be a valid UUID'
        }),
    stock: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'Stock must be a number',
            'number.integer': 'Stock must be an integer',
            'number.min': 'Stock must be 0 or greater'
        }),
    lowStockThreshold: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'Low stock threshold must be a number',
            'number.integer': 'Low stock threshold must be an integer',
            'number.min': 'Low stock threshold must be 0 or greater'
        }),
    weight: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Weight must be a number',
            'number.positive': 'Weight must be positive'
        }),
    dimensions: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Dimensions must not exceed 100 characters'
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is active must be a boolean'
        }),
    isDigital: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is digital must be a boolean'
        }),
    isFeatured: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is featured must be a boolean'
        }),
    metaTitle: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'Meta title must not exceed 255 characters'
        }),
    metaDescription: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Meta description must not exceed 500 characters'
        }),
    tags: Joi.array()
        .items(Joi.string().max(50))
        .optional()
        .messages({
            'array.base': 'Tags must be an array',
            'string.max': 'Each tag must not exceed 50 characters'
        })
});

// Product query schema
const productQuerySchema = Joi.object({
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
    search: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'Search term must not exceed 255 characters'
        }),
    category: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Category must be a valid UUID'
        }),
    brand: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Brand must be a valid UUID'
        }),
    minPrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Minimum price must be a number',
            'number.positive': 'Minimum price must be positive'
        }),
    maxPrice: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Maximum price must be a number',
            'number.positive': 'Maximum price must be positive'
        }),
    rating: Joi.number()
        .min(1)
        .max(5)
        .optional()
        .messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be 1 or greater',
            'number.max': 'Rating must be 5 or less'
        }),
    sortBy: Joi.string()
        .valid('name', 'price', 'rating', 'createdAt')
        .optional()
        .messages({
            'any.only': 'Sort by must be one of: name, price, rating, createdAt'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .messages({
            'any.only': 'Sort order must be either asc or desc'
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is active must be a boolean'
        }),
    isFeatured: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is featured must be a boolean'
        })
});

// Product ID parameter schema
const productIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Product ID is required',
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        })
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
    productIdSchema
};
