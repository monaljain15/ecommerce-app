import { Brand, Product } from '../../models';
import { AppError } from '../../middleware/errorHandler';
import { Op } from 'sequelize';

// Define explicit return types to avoid TypeScript export issues
interface BrandData {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    isActive: boolean;
    sortOrder: number;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
}

interface PaginatedBrands {
    brands: BrandData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get all brands
export async function getBrands(filters: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
} = {}): Promise<PaginatedBrands> {
    const {
        isActive = true,
        search,
        page = 1,
        limit = 50
    } = filters;

    const whereClause: any = {};

    if (isActive !== undefined) {
        whereClause.isActive = isActive;
    }

    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } }
        ];
    }

    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Brand.findAndCountAll({
            where: whereClause,
            order: [['sortOrder', 'ASC'], ['name', 'ASC']],
            limit,
            offset,
            distinct: true
        });

        // Get product count for each brand
        const brandsWithCount = await Promise.all(
            rows.map(async (brand) => {
                const productCount = await Product.count({
                    where: { brandId: brand.id, isActive: true }
                });

                return {
                    id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    description: brand.description,
                    logo: brand.logo,
                    website: brand.website,
                    isActive: brand.isActive,
                    sortOrder: brand.sortOrder,
                    productCount,
                    createdAt: brand.createdAt,
                    updatedAt: brand.updatedAt
                };
            })
        );

        return {
            brands: brandsWithCount,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        };
    } catch (error: any) {
        console.error('Error fetching brands:', error);
        throw new AppError('Failed to fetch brands', 500);
    }
}

// Get single brand by ID
export async function getBrandById(id: string): Promise<BrandData> {
    try {
        const brand = await Brand.findByPk(id);

        if (!brand) {
            throw new AppError('Brand not found', 404);
        }

        const productCount = await Product.count({
            where: { brandId: brand.id, isActive: true }
        });

        return {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            description: brand.description,
            logo: brand.logo,
            website: brand.website,
            isActive: brand.isActive,
            sortOrder: brand.sortOrder,
            productCount,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt
        };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error fetching brand:', error);
        throw new AppError('Failed to fetch brand', 500);
    }
}

// Get brand by slug
export async function getBrandBySlug(slug: string): Promise<BrandData> {
    try {
        const brand = await Brand.findOne({
            where: { slug }
        });

        if (!brand) {
            throw new AppError('Brand not found', 404);
        }

        const productCount = await Product.count({
            where: { brandId: brand.id, isActive: true }
        });

        return {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            description: brand.description,
            logo: brand.logo,
            website: brand.website,
            isActive: brand.isActive,
            sortOrder: brand.sortOrder,
            productCount,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt
        };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error fetching brand by slug:', error);
        throw new AppError('Failed to fetch brand', 500);
    }
}

// Get brand statistics
export async function getBrandStats(): Promise<{
    totalBrands: number;
    activeBrands: number;
    brandsWithProducts: number;
    averageProductsPerBrand: number;
}> {
    try {
        const [
            totalBrands,
            activeBrands,
            brandsWithProducts,
            totalProducts
        ] = await Promise.all([
            Brand.count(),
            Brand.count({ where: { isActive: true } }),
            Brand.count({
                include: [{
                    model: Product,
                    as: 'products',
                    where: { isActive: true },
                    required: true
                }]
            }),
            Product.count({ where: { isActive: true } })
        ]);

        const averageProductsPerBrand = brandsWithProducts > 0
            ? Math.round((totalProducts / brandsWithProducts) * 100) / 100
            : 0;

        return {
            totalBrands,
            activeBrands,
            brandsWithProducts,
            averageProductsPerBrand
        };
    } catch (error: any) {
        console.error('Error fetching brand stats:', error);
        throw new AppError('Failed to fetch brand statistics', 500);
    }
}

export default {
    getBrands,
    getBrandById,
    getBrandBySlug,
    getBrandStats
};
