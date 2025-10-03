import { body, param, query } from 'express-validator';

export const paymentValidators = {
    createPaymentIntent: [
        body('orderId')
            .notEmpty()
            .withMessage('Order ID is required')
            .isString()
            .withMessage('Order ID must be a string'),
        body('amount')
            .isFloat({ min: 0.01 })
            .withMessage('Amount must be a positive number'),
        body('currency')
            .optional()
            .isString()
            .withMessage('Currency must be a string')
            .isLength({ min: 3, max: 3 })
            .withMessage('Currency must be a 3-letter code')
    ],

    confirmPayment: [
        body('paymentIntentId')
            .notEmpty()
            .withMessage('Payment intent ID is required')
            .isString()
            .withMessage('Payment intent ID must be a string')
    ],

    processRefund: [
        body('paymentId')
            .notEmpty()
            .withMessage('Payment ID is required')
            .isString()
            .withMessage('Payment ID must be a string'),
        body('amount')
            .isFloat({ min: 0.01 })
            .withMessage('Refund amount must be a positive number'),
        body('reason')
            .optional()
            .isString()
            .withMessage('Reason must be a string')
    ],

    getPayment: [
        param('id')
            .notEmpty()
            .withMessage('Payment ID is required')
            .isString()
            .withMessage('Payment ID must be a string')
    ],

    getPaymentHistory: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ]
};
