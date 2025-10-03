import * as Joi from 'joi';

// Get products schema
export const getProductsSchema = Joi.object({
    search: Joi.string().min(1).max(255).optional(),
    category: Joi.string().uuid().optional(),
    brand: Joi.string().uuid().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    rating: Joi.number().min(0).max(5).optional(),
    isFeatured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    sortBy: Joi.string().valid('name', 'price', 'rating', 'createdAt', 'updatedAt').optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
});

// Get featured products schema
export const getFeaturedProductsSchema = Joi.object({
    limit: Joi.number().integer().min(1).max(50).optional()
});

// Search products schema
export const searchProductsSchema = Joi.object({
    q: Joi.string().min(1).max(255).required(),
    category: Joi.string().uuid().optional(),
    brand: Joi.string().uuid().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    rating: Joi.number().min(0).max(5).optional(),
    isFeatured: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    sortBy: Joi.string().valid('name', 'price', 'rating', 'createdAt', 'updatedAt').optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
});

// Product ID schema
export const productIdSchema = Joi.object({
    id: Joi.string().uuid().required()
});

// Product slug schema
export const productSlugSchema = Joi.object({
    slug: Joi.string().min(1).max(255).required()
});

// Get related products schema
export const getRelatedProductsSchema = Joi.object({
    limit: Joi.number().integer().min(1).max(20).optional()
});

// Check stock schema
export const checkStockSchema = Joi.object({
    quantity: Joi.number().integer().min(1).optional()
});

// Category schemas
export const getCategoriesSchema = Joi.object({
    isActive: Joi.boolean().optional(),
    parentId: Joi.string().uuid().optional(),
    search: Joi.string().min(1).max(255).optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
});

export const categoryIdSchema = Joi.object({
    id: Joi.string().uuid().required()
});

export const categorySlugSchema = Joi.object({
    slug: Joi.string().min(1).max(255).required()
});

// Brand schemas
export const getBrandsSchema = Joi.object({
    isActive: Joi.boolean().optional(),
    search: Joi.string().min(1).max(255).optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
});

export const brandIdSchema = Joi.object({
    id: Joi.string().uuid().required()
});

export const brandSlugSchema = Joi.object({
    slug: Joi.string().min(1).max(255).required()
});

// Favorites schemas
export const getFavoritesSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().min(1).max(255).optional()
});

export const addToFavoritesSchema = Joi.object({
    productId: Joi.string().uuid().required()
});

export const favoriteIdSchema = Joi.object({
    favoriteId: Joi.string().uuid().required()
});