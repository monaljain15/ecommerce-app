import { Favorite, Product, User } from '../../models';
import { AppError } from '../../middleware/errorHandler';
import { Op } from 'sequelize';

// Define explicit return types to avoid TypeScript export issues
interface FavoriteData {
    id: string;
    userId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        image: string;
        images: string[];
        brand: string;
        rating: number;
        reviewCount: number;
        stock: number;
        category: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

interface PaginatedFavorites {
    favorites: FavoriteData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get user's favorites
export async function getFavorites(userId: string, filters: {
    page?: number;
    limit?: number;
    search?: string;
} = {}): Promise<PaginatedFavorites> {
    const {
        page = 1,
        limit = 20,
        search
    } = filters;

    const whereClause: any = { userId };

    if (search) {
        whereClause[Op.or] = [
            { '$product.name$': { [Op.iLike]: `%${search}%` } },
            { '$product.description$': { [Op.iLike]: `%${search}%` } }
        ];
    }

    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Favorite.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: [
                        'id', 'name', 'slug', 'price', 'image', 'images',
                        'rating', 'reviewCount', 'stock'
                    ],
                    include: [
                        {
                            model: User,
                            as: 'brand',
                            attributes: ['name']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        const favorites = rows.map(favorite => ({
            id: favorite.id,
            userId: favorite.userId,
            productId: favorite.productId,
            product: {
                id: (favorite as any).product.id,
                name: (favorite as any).product.name,
                slug: (favorite as any).product.slug,
                price: parseFloat((favorite as any).product.price.toString()),
                image: (favorite as any).product.image,
                images: (favorite as any).product.images || [],
                brand: (favorite as any).product.brand?.name || 'Unknown',
                rating: parseFloat((favorite as any).product.rating.toString()),
                reviewCount: (favorite as any).product.reviewCount,
                stock: (favorite as any).product.stock,
                category: 'Unknown' // This would need to be included from category relationship
            },
            createdAt: favorite.createdAt,
            updatedAt: favorite.updatedAt
        }));

        return {
            favorites,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        };
    } catch (error: any) {
        console.error('Error fetching favorites:', error);
        throw new AppError('Failed to fetch favorites', 500);
    }
}

// Add product to favorites
export async function addToFavorites(userId: string, productId: string): Promise<FavoriteData> {
    try {
        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        // Check if already in favorites
        const existingFavorite = await Favorite.findOne({
            where: { userId, productId }
        });

        if (existingFavorite) {
            throw new AppError('Product is already in favorites', 400);
        }

        // Create favorite
        const favorite = await Favorite.create({
            userId,
            productId
        });

        // Fetch the created favorite with product details
        const favoriteWithProduct = await Favorite.findByPk(favorite.id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: [
                        'id', 'name', 'slug', 'price', 'image', 'images',
                        'rating', 'reviewCount', 'stock'
                    ],
                    include: [
                        {
                            model: User,
                            as: 'brand',
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });

        return {
            id: favoriteWithProduct!.id,
            userId: favoriteWithProduct!.userId,
            productId: favoriteWithProduct!.productId,
            product: {
                id: (favoriteWithProduct as any).product.id,
                name: (favoriteWithProduct as any).product.name,
                slug: (favoriteWithProduct as any).product.slug,
                price: parseFloat((favoriteWithProduct as any).product.price.toString()),
                image: (favoriteWithProduct as any).product.image,
                images: (favoriteWithProduct as any).product.images || [],
                brand: (favoriteWithProduct as any).product.brand?.name || 'Unknown',
                rating: parseFloat((favoriteWithProduct as any).product.rating.toString()),
                reviewCount: (favoriteWithProduct as any).product.reviewCount,
                stock: (favoriteWithProduct as any).product.stock,
                category: 'Unknown'
            },
            createdAt: favoriteWithProduct!.createdAt,
            updatedAt: favoriteWithProduct!.updatedAt
        };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error adding to favorites:', error);
        throw new AppError('Failed to add to favorites', 500);
    }
}

// Remove product from favorites
export async function removeFromFavorites(userId: string, favoriteId: string): Promise<void> {
    try {
        const favorite = await Favorite.findOne({
            where: { id: favoriteId, userId }
        });

        if (!favorite) {
            throw new AppError('Favorite not found', 404);
        }

        await favorite.destroy();
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error removing from favorites:', error);
        throw new AppError('Failed to remove from favorites', 500);
    }
}

// Remove product from favorites by product ID
export async function removeFromFavoritesByProductId(userId: string, productId: string): Promise<void> {
    try {
        const favorite = await Favorite.findOne({
            where: { userId, productId }
        });

        if (!favorite) {
            throw new AppError('Product not found in favorites', 404);
        }

        await favorite.destroy();
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error removing from favorites by product ID:', error);
        throw new AppError('Failed to remove from favorites', 500);
    }
}

// Check if product is in favorites
export async function isProductFavorited(userId: string, productId: string): Promise<boolean> {
    try {
        const favorite = await Favorite.findOne({
            where: { userId, productId }
        });

        return !!favorite;
    } catch (error: any) {
        console.error('Error checking if product is favorited:', error);
        throw new AppError('Failed to check favorite status', 500);
    }
}

// Get favorites count for user
export async function getFavoritesCount(userId: string): Promise<number> {
    try {
        const count = await Favorite.count({
            where: { userId }
        });

        return count;
    } catch (error: any) {
        console.error('Error getting favorites count:', error);
        throw new AppError('Failed to get favorites count', 500);
    }
}

// Clear all favorites for user
export async function clearAllFavorites(userId: string): Promise<void> {
    try {
        await Favorite.destroy({
            where: { userId }
        });
    } catch (error: any) {
        console.error('Error clearing favorites:', error);
        throw new AppError('Failed to clear favorites', 500);
    }
}

// Get favorite statistics
export async function getFavoriteStats(userId: string): Promise<{
    totalFavorites: number;
    recentFavorites: number;
    favoriteCategories: { category: string; count: number }[];
}> {
    try {
        const [
            totalFavorites,
            recentFavorites,
            favoriteCategories
        ] = await Promise.all([
            Favorite.count({ where: { userId } }),
            Favorite.count({
                where: {
                    userId,
                    createdAt: {
                        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                }
            }),
            // This would need to be implemented with proper category relationships
            Promise.resolve([])
        ]);

        return {
            totalFavorites,
            recentFavorites,
            favoriteCategories
        };
    } catch (error: any) {
        console.error('Error getting favorite stats:', error);
        throw new AppError('Failed to get favorite statistics', 500);
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
