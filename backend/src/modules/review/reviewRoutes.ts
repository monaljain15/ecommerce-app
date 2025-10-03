import express from 'express';
import { reviewController } from './reviewController';
import { reviewValidators } from './reviewValidator';
import { authMiddleware } from '../auth/authMiddleware';

const router = express.Router();

// @route   GET /api/reviews/:productId
// @desc    Get product reviews
// @access  Public
router.get('/:productId', reviewValidators.getReviews, reviewController.getReviews);

// @route   GET /api/reviews/stats/:productId
// @desc    Get product review statistics
// @access  Public
router.get('/stats/:productId', reviewValidators.getReviewStats, reviewController.getReviewStats);

// @route   GET /api/reviews/user/:userId
// @desc    Get user reviews
// @access  Private
router.get('/user/:userId', authMiddleware.authenticate, reviewValidators.getUserReviews, reviewController.getUserReviews);

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', authMiddleware.authenticate, reviewValidators.createReview, reviewController.createReview);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', authMiddleware.authenticate, reviewValidators.updateReview, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', authMiddleware.authenticate, reviewValidators.deleteReview, reviewController.deleteReview);

export default router;
