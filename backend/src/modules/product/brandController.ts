import { Request, Response, NextFunction } from 'express';
import * as brandService from './brandService';

// Get all brands
export async function getBrands(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = {
            isActive: req.query.isActive ? req.query.isActive === 'true' : true,
            search: req.query.search as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 50
        };

        const result = await brandService.getBrands(filters);

        res.json({
            success: true,
            data: result.brands,
            pagination: result.pagination
        });
    } catch (error: any) {
        next(error);
    }
}

// Get single brand by ID
export async function getBrandById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const brand = await brandService.getBrandById(id);

        res.json({
            success: true,
            data: brand
        });
    } catch (error: any) {
        next(error);
    }
}

// Get single brand by slug
export async function getBrandBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;
        const brand = await brandService.getBrandBySlug(slug);

        res.json({
            success: true,
            data: brand
        });
    } catch (error: any) {
        next(error);
    }
}

// Get brand statistics
export async function getBrandStats(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await brandService.getBrandStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        next(error);
    }
}

export default {
    getBrands,
    getBrandById,
    getBrandBySlug,
    getBrandStats
};
