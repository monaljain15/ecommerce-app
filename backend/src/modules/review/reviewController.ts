import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { reviewService } from './reviewService';

export const reviewController = {
    // @route   GET /api/reviews/:productId
    // @desc    Get product reviews
    // @access  Public
    async getReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const rating = req.query.rating as string;

            const result = await reviewService.getReviews(productId, {
                page,
                limit,
                rating: rating ? parseInt(rating) : undefined
            });

            res.json({
                success: true,
                data: result.reviews,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   POST /api/reviews
    // @desc    Create review
    // @access  Private
    async createReview(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { productId, orderId, rating, comment } = req.body;
            const review = await reviewService.createReview(userId, {
                productId,
                orderId,
                rating,
                comment
            });

            res.status(201).json({
                success: true,
                message: 'Review created successfully',
                data: review
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   PUT /api/reviews/:id
    // @desc    Update review
    // @access  Private
    async updateReview(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { id } = req.params;
            const { rating, comment } = req.body;
            const review = await reviewService.updateReview(userId, id, { rating, comment });

            res.json({
                success: true,
                message: 'Review updated successfully',
                data: review
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   DELETE /api/reviews/:id
    // @desc    Delete review
    // @access  Private
    async deleteReview(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { id } = req.params;
            await reviewService.deleteReview(userId, id);

            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   GET /api/reviews/user/:userId
    // @desc    Get user reviews
    // @access  Private
    async getUserReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await reviewService.getUserReviews(userId, {
                page,
                limit
            });

            res.json({
                success: true,
                data: result.reviews,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   GET /api/reviews/stats/:productId
    // @desc    Get product review statistics
    // @access  Public
    async getReviewStats(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const stats = await reviewService.getReviewStats(productId);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
};
