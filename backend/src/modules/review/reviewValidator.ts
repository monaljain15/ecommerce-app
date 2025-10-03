import { body, param, query } from 'express-validator';

export const reviewValidators = {
    createReview: [
        body('productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isString()
            .withMessage('Product ID must be a string'),
        body('orderId')
            .notEmpty()
            .withMessage('Order ID is required')
            .isString()
            .withMessage('Order ID must be a string'),
        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('comment')
            .notEmpty()
            .withMessage('Comment is required')
            .isLength({ min: 10, max: 1000 })
            .withMessage('Comment must be between 10 and 1000 characters')
    ],

    updateReview: [
        param('id')
            .notEmpty()
            .withMessage('Review ID is required')
            .isString()
            .withMessage('Review ID must be a string'),
        body('rating')
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('comment')
            .optional()
            .isLength({ min: 10, max: 1000 })
            .withMessage('Comment must be between 10 and 1000 characters')
    ],

    deleteReview: [
        param('id')
            .notEmpty()
            .withMessage('Review ID is required')
            .isString()
            .withMessage('Review ID must be a string')
    ],

    getReviews: [
        param('productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isString()
            .withMessage('Product ID must be a string'),
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('rating')
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5')
    ],

    getUserReviews: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ],

    getReviewStats: [
        param('productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isString()
            .withMessage('Product ID must be a string')
    ]
};
