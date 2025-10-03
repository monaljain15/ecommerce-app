import { Request, Response, NextFunction } from 'express';
import * as productService from './productService';
import { AppError } from '../../middleware/errorHandler';

// Get all products with filtering and pagination
export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = {
            search: req.query.search as string,
            category: req.query.category as string,
            brand: req.query.brand as string,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
            rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
            isFeatured: req.query.isFeatured ? req.query.isFeatured === 'true' : undefined,
            isActive: req.query.isActive ? req.query.isActive === 'true' : true,
            sortBy: req.query.sortBy as 'name' | 'price' | 'rating' | 'createdAt' | 'updatedAt' || 'createdAt',
            sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 12
        };

        const result = await productService.getProducts(filters);

        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error: any) {
        next(error);
    }
}

// Get single product by ID
export async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        res.json({
            success: true,
            data: product
        });
    } catch (error: any) {
        next(error);
    }
}

// Get single product by slug
export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;
        const product = await productService.getProductBySlug(slug);

        res.json({
            success: true,
            data: product
        });
    } catch (error: any) {
        next(error);
    }
}

// Get featured products
export async function getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
        const products = await productService.getFeaturedProducts(limit);

        res.json({
            success: true,
            data: products
        });
    } catch (error: any) {
        next(error);
    }
}

// Search products
export async function searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { q: query } = req.query;

        if (!query || typeof query !== 'string') {
            throw new AppError('Search query is required', 400);
        }

        const filters = {
            search: query,
            category: req.query.category as string,
            brand: req.query.brand as string,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
            rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
            isFeatured: req.query.isFeatured ? req.query.isFeatured === 'true' : undefined,
            isActive: req.query.isActive ? req.query.isActive === 'true' : true,
            sortBy: req.query.sortBy as 'name' | 'price' | 'rating' | 'createdAt' | 'updatedAt' || 'createdAt',
            sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 12
        };

        const result = await productService.searchProducts(query, filters);

        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error: any) {
        next(error);
    }
}

// Get related products
export async function getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;

        const products = await productService.getRelatedProducts(id, limit);

        res.json({
            success: true,
            data: products
        });
    } catch (error: any) {
        next(error);
    }
}

// Get product statistics
export async function getProductStats(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await productService.getProductStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        next(error);
    }
}

// Check product stock
export async function checkProductStock(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const quantity = req.query.quantity ? parseInt(req.query.quantity as string) : 1;

        const isInStock = await productService.checkProductStock(id, quantity);

        res.json({
            success: true,
            data: {
                productId: id,
                quantity,
                isInStock
            }
        });
    } catch (error: any) {
        next(error);
    }
}

export default {
    getProducts,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    searchProducts,
    getRelatedProducts,
    getProductStats,
    checkProductStock
};