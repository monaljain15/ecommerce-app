import { body, param } from 'express-validator';

export const cartValidators = {
    addToCart: [
        body('productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isString()
            .withMessage('Product ID must be a string'),
        body('quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer')
    ],

    updateCartItem: [
        param('id')
            .notEmpty()
            .withMessage('Cart item ID is required')
            .isString()
            .withMessage('Cart item ID must be a string'),
        body('quantity')
            .isInt({ min: 0 })
            .withMessage('Quantity must be a non-negative integer')
    ],

    removeFromCart: [
        param('id')
            .notEmpty()
            .withMessage('Cart item ID is required')
            .isString()
            .withMessage('Cart item ID must be a string')
    ]
};
