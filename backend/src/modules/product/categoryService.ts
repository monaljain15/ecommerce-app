import { Category, Product } from '../../models';
import { AppError } from '../../middleware/errorHandler';
import { Op } from 'sequelize';

// Define explicit return types to avoid TypeScript export issues
interface CategoryData {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive: boolean;
    sortOrder: number;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
}

interface PaginatedCategories {
    categories: CategoryData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get all categories
export async function getCategories(filters: {
    isActive?: boolean;
    parentId?: string;
    search?: string;
    page?: number;
    limit?: number;
} = {}): Promise<PaginatedCategories> {
    const {
        isActive = true,
        parentId,
        search,
        page = 1,
        limit = 50
    } = filters;

    const whereClause: any = {};

    if (isActive !== undefined) {
        whereClause.isActive = isActive;
    }

    if (parentId !== undefined) {
        whereClause.parentId = parentId;
    }

    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } }
        ];
    }

    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Category.findAndCountAll({
            where: whereClause,
            order: [['sortOrder', 'ASC'], ['name', 'ASC']],
            limit,
            offset,
            distinct: true
        });

        // Get product count for each category
        const categoriesWithCount = await Promise.all(
            rows.map(async (category) => {
                const productCount = await Product.count({
                    where: { categoryId: category.id, isActive: true }
                });

                return {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    image: category.image,
                    parentId: category.parentId,
                    isActive: category.isActive,
                    sortOrder: category.sortOrder,
                    productCount,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt
                };
            })
        );

        return {
            categories: categoriesWithCount,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        };
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        throw new AppError('Failed to fetch categories', 500);
    }
}

// Get single category by ID
export async function getCategoryById(id: string): Promise<CategoryData> {
    try {
        const category = await Category.findByPk(id);

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        const productCount = await Product.count({
            where: { categoryId: category.id, isActive: true }
        });

        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            parentId: category.parentId,
            isActive: category.isActive,
            sortOrder: category.sortOrder,
            productCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error fetching category:', error);
        throw new AppError('Failed to fetch category', 500);
    }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<CategoryData> {
    try {
        const category = await Category.findOne({
            where: { slug }
        });

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        const productCount = await Product.count({
            where: { categoryId: category.id, isActive: true }
        });

        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            parentId: category.parentId,
            isActive: category.isActive,
            sortOrder: category.sortOrder,
            productCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error fetching category by slug:', error);
        throw new AppError('Failed to fetch category', 500);
    }
}

// Get category tree (hierarchical structure)
export async function getCategoryTree(): Promise<CategoryData[]> {
    try {
        const categories = await Category.findAll({
            where: { isActive: true },
            order: [['sortOrder', 'ASC'], ['name', 'ASC']]
        });

        // Get product count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.count({
                    where: { categoryId: category.id, isActive: true }
                });

                return {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    image: category.image,
                    parentId: category.parentId,
                    isActive: category.isActive,
                    sortOrder: category.sortOrder,
                    productCount,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt
                };
            })
        );

        // Build tree structure
        const categoryMap = new Map<string, CategoryData & { children: CategoryData[] }>();
        const rootCategories: (CategoryData & { children: CategoryData[] })[] = [];

        // First pass: create map
        categoriesWithCount.forEach(category => {
            categoryMap.set(category.id, { ...category, children: [] });
        });

        // Second pass: build tree
        categoriesWithCount.forEach(category => {
            const categoryWithChildren = categoryMap.get(category.id)!;
            if (category.parentId) {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(categoryWithChildren);
                }
            } else {
                rootCategories.push(categoryWithChildren);
            }
        });

        return rootCategories;
    } catch (error: any) {
        console.error('Error fetching category tree:', error);
        throw new AppError('Failed to fetch category tree', 500);
    }
}

// Get category statistics
export async function getCategoryStats(): Promise<{
    totalCategories: number;
    activeCategories: number;
    categoriesWithProducts: number;
    averageProductsPerCategory: number;
}> {
    try {
        const [
            totalCategories,
            activeCategories,
            categoriesWithProducts,
            totalProducts
        ] = await Promise.all([
            Category.count(),
            Category.count({ where: { isActive: true } }),
            Category.count({
                include: [{
                    model: Product,
                    as: 'products',
                    where: { isActive: true },
                    required: true
                }]
            }),
            Product.count({ where: { isActive: true } })
        ]);

        const averageProductsPerCategory = categoriesWithProducts > 0
            ? Math.round((totalProducts / categoriesWithProducts) * 100) / 100
            : 0;

        return {
            totalCategories,
            activeCategories,
            categoriesWithProducts,
            averageProductsPerCategory
        };
    } catch (error: any) {
        console.error('Error fetching category stats:', error);
        throw new AppError('Failed to fetch category statistics', 500);
    }
}

export default {
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    getCategoryTree,
    getCategoryStats
};
