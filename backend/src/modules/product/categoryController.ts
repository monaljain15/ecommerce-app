import { Request, Response, NextFunction } from 'express';
import * as categoryService from './categoryService';

// Get all categories
export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = {
            isActive: req.query.isActive ? req.query.isActive === 'true' : true,
            parentId: req.query.parentId as string,
            search: req.query.search as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 50
        };

        const result = await categoryService.getCategories(filters);

        res.json({
            success: true,
            data: result.categories,
            pagination: result.pagination
        });
    } catch (error: any) {
        next(error);
    }
}

// Get single category by ID
export async function getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);

        res.json({
            success: true,
            data: category
        });
    } catch (error: any) {
        next(error);
    }
}

// Get single category by slug
export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlug(slug);

        res.json({
            success: true,
            data: category
        });
    } catch (error: any) {
        next(error);
    }
}

// Get category tree
export async function getCategoryTree(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await categoryService.getCategoryTree();

        res.json({
            success: true,
            data: categories
        });
    } catch (error: any) {
        next(error);
    }
}

// Get category statistics
export async function getCategoryStats(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await categoryService.getCategoryStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        next(error);
    }
}

export default {
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    getCategoryTree,
    getCategoryStats
};
