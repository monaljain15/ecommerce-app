import { Product, Category, Brand, Review } from '../../models';
import { AppError } from '../../middleware/errorHandler';
import { Op } from 'sequelize';
import sequelize from '../../config/database';

// Define explicit return types to avoid TypeScript export issues
interface ProductData {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    costPrice?: number;
    sku?: string;
    barcode?: string;
    image: string;
    images?: string[];
    category: {
        id: string;
        name: string;
        slug: string;
    };
    brand: {
        id: string;
        name: string;
        slug: string;
    };
    stock: number;
    lowStockThreshold: number;
    weight?: number;
    dimensions?: string;
    rating: number;
    reviewCount: number;
    isActive: boolean;
    isDigital: boolean;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface PaginatedProducts {
    products: ProductData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface ProductFilters {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    isFeatured?: boolean;
    isActive?: boolean;
    sortBy?: 'name' | 'price' | 'rating' | 'createdAt' | 'updatedAt';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}

// Helper function to format product data
const formatProductData = (product: any): ProductData => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: parseFloat(product.price.toString()),
    comparePrice: product.comparePrice ? parseFloat(product.comparePrice.toString()) : undefined,
    costPrice: product.costPrice ? parseFloat(product.costPrice.toString()) : undefined,
    sku: product.sku,
    barcode: product.barcode,
    image: product.image,
    images: product.images || [],
    category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
    },
    brand: {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug
    },
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    weight: product.weight ? parseFloat(product.weight.toString()) : undefined,
    dimensions: product.dimensions,
    rating: parseFloat(product.rating.toString()),
    reviewCount: product.reviewCount,
    isActive: product.isActive,
    isDigital: product.isDigital,
    isFeatured: product.isFeatured,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    tags: product.tags || [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
});

// Get all products with filtering, searching, and pagination
export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    const {
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        isFeatured,
        isActive = true,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        page = 1,
        limit = 12
    } = filters;

    const whereClause: any = {};

    // Search filter
    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { shortDescription: { [Op.iLike]: `%${search}%` } },
            { tags: { [Op.contains]: [search] } }
        ];
    }

    // Category filter
    if (category) {
        whereClause.categoryId = category;
    }

    // Brand filter
    if (brand) {
        whereClause.brandId = brand;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        whereClause.price = {};
        if (minPrice !== undefined) {
            whereClause.price[Op.gte] = minPrice;
        }
        if (maxPrice !== undefined) {
            whereClause.price[Op.lte] = maxPrice;
        }
    }

    // Rating filter
    if (rating !== undefined) {
        whereClause.rating = { [Op.gte]: rating };
    }

    // Featured filter
    if (isFeatured !== undefined) {
        whereClause.isFeatured = isFeatured;
    }

    // Active filter
    if (isActive !== undefined) {
        whereClause.isActive = isActive;
    }

    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [[sortBy, sortOrder]],
            limit,
            offset,
            distinct: true
        });

        const products = rows.map(formatProductData);

        return {
            products,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        };
    } catch (error: any) {
        console.error('Error fetching products:', error);
        throw new AppError('Failed to fetch products', 500);
    }
}

// Get single product by ID
export async function getProductById(id: string): Promise<ProductData> {
    try {
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return formatProductData(product);
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error fetching product:', error);
        throw new AppError('Failed to fetch product', 500);
    }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<ProductData> {
    try {
        const product = await Product.findOne({
            where: { slug },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return formatProductData(product);
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error fetching product by slug:', error);
        throw new AppError('Failed to fetch product', 500);
    }
}

// Get featured products
export async function getFeaturedProducts(limit: number = 6): Promise<ProductData[]> {
    try {
        const products = await Product.findAll({
            where: {
                isFeatured: true,
                isActive: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['rating', 'DESC']],
            limit
        });

        return products.map(formatProductData);
    } catch (error: any) {
        console.error('Error fetching featured products:', error);
        throw new AppError('Failed to fetch featured products', 500);
    }
}

// Search products
export async function searchProducts(query: string, filters: ProductFilters = {}): Promise<PaginatedProducts> {
    return getProducts({
        ...filters,
        search: query
    });
}

// Get related products
export async function getRelatedProducts(productId: string, limit: number = 4): Promise<ProductData[]> {
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        const relatedProducts = await Product.findAll({
            where: {
                id: { [Op.ne]: productId },
                categoryId: product.categoryId,
                isActive: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Brand,
                    as: 'brand',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['rating', 'DESC']],
            limit
        });

        return relatedProducts.map(formatProductData);
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error fetching related products:', error);
        throw new AppError('Failed to fetch related products', 500);
    }
}

// Update product rating and review count
export async function updateProductRating(productId: string): Promise<void> {
    try {
        const reviews = await Review.findAll({
            where: { productId },
            attributes: ['rating']
        });

        if (reviews.length === 0) {
            await Product.update(
                { rating: 0, reviewCount: 0 },
                { where: { id: productId } }
            );
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const reviewCount = reviews.length;

        await Product.update(
            {
                rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
                reviewCount
            },
            { where: { id: productId } }
        );
    } catch (error: any) {
        console.error('Error updating product rating:', error);
        throw new AppError('Failed to update product rating', 500);
    }
}

// Get product statistics
export async function getProductStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    featuredProducts: number;
    lowStockProducts: number;
    averageRating: number;
    totalReviews: number;
}> {
    try {
        const [
            totalProducts,
            activeProducts,
            featuredProducts,
            lowStockProducts,
            averageRatingResult,
            totalReviews
        ] = await Promise.all([
            Product.count(),
            Product.count({ where: { isActive: true } }),
            Product.count({ where: { isFeatured: true, isActive: true } }),
            Product.count({
                where: {
                    stock: { [Op.lte]: sequelize.col('lowStockThreshold') },
                    isActive: true
                }
            }),
            Product.findOne({
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
                ],
                where: { isActive: true }
            }),
            Review.count()
        ]);

        const averageRating = averageRatingResult ?
            parseFloat((averageRatingResult as any).dataValues.averageRating || '0') : 0;

        return {
            totalProducts,
            activeProducts,
            featuredProducts,
            lowStockProducts,
            averageRating: Math.round(averageRating * 100) / 100,
            totalReviews
        };
    } catch (error: any) {
        console.error('Error fetching product stats:', error);
        throw new AppError('Failed to fetch product statistics', 500);
    }
}

// Check if product is in stock
export async function checkProductStock(productId: string, quantity: number = 1): Promise<boolean> {
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return product.stock >= quantity;
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error checking product stock:', error);
        throw new AppError('Failed to check product stock', 500);
    }
}

// Update product stock
export async function updateProductStock(productId: string, quantity: number, operation: 'add' | 'subtract' = 'subtract'): Promise<void> {
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        const newStock = operation === 'add'
            ? product.stock + quantity
            : product.stock - quantity;

        if (newStock < 0) {
            throw new AppError('Insufficient stock', 400);
        }

        await Product.update(
            { stock: newStock },
            { where: { id: productId } }
        );
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error updating product stock:', error);
        throw new AppError('Failed to update product stock', 500);
    }
}

export default {
    getProducts,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    searchProducts,
    getRelatedProducts,
    updateProductRating,
    getProductStats,
    checkProductStock,
    updateProductStock
};