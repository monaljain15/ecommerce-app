import { Request, Response, NextFunction } from 'express';
import * as favoritesService from './favoritesService';

// Authenticated request interface
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

// Get user's favorites
export async function getFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const filters = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            search: req.query.search as string
        };

        const result = await favoritesService.getFavorites(userId, filters);

        res.json({
            success: true,
            data: result.favorites,
            pagination: result.pagination
        });
    } catch (error: any) {
        next(error);
    }
}

// Add product to favorites
export async function addToFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const favorite = await favoritesService.addToFavorites(userId, productId);

        res.status(201).json({
            success: true,
            message: 'Product added to favorites',
            data: favorite
        });
    } catch (error: any) {
        next(error);
    }
}

// Remove product from favorites
export async function removeFromFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const { favoriteId } = req.params;

        await favoritesService.removeFromFavorites(userId, favoriteId);

        res.json({
            success: true,
            message: 'Product removed from favorites'
        });
    } catch (error: any) {
        next(error);
    }
}

// Remove product from favorites by product ID
export async function removeFromFavoritesByProductId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const { productId } = req.params;

        await favoritesService.removeFromFavoritesByProductId(userId, productId);

        res.json({
            success: true,
            message: 'Product removed from favorites'
        });
    } catch (error: any) {
        next(error);
    }
}

// Check if product is in favorites
export async function isProductFavorited(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const { productId } = req.params;

        const isFavorited = await favoritesService.isProductFavorited(userId, productId);

        res.json({
            success: true,
            data: {
                productId,
                isFavorited
            }
        });
    } catch (error: any) {
        next(error);
    }
}

// Get favorites count
export async function getFavoritesCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const count = await favoritesService.getFavoritesCount(userId);

        res.json({
            success: true,
            data: {
                count
            }
        });
    } catch (error: any) {
        next(error);
    }
}

// Clear all favorites
export async function clearAllFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        await favoritesService.clearAllFavorites(userId);

        res.json({
            success: true,
            message: 'All favorites cleared'
        });
    } catch (error: any) {
        next(error);
    }
}

// Get favorite statistics
export async function getFavoriteStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const stats = await favoritesService.getFavoriteStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        next(error);
    }
}

export default {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    removeFromFavoritesByProductId,
    isProductFavorited,
    getFavoritesCount,
    clearAllFavorites,
    getFavoriteStats
};
