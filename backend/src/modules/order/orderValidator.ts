import { body, param, query } from 'express-validator';

export const orderValidators = {
    createOrder: [
        body('items')
            .isArray({ min: 1 })
            .withMessage('Order must have at least one item'),
        body('items.*.productId')
            .notEmpty()
            .withMessage('Product ID is required for each item')
            .isString()
            .withMessage('Product ID must be a string'),
        body('items.*.quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer'),
        body('shippingAddress')
            .isObject()
            .withMessage('Shipping address is required'),
        body('shippingAddress.firstName')
            .notEmpty()
            .withMessage('First name is required'),
        body('shippingAddress.lastName')
            .notEmpty()
            .withMessage('Last name is required'),
        body('shippingAddress.address')
            .notEmpty()
            .withMessage('Address is required'),
        body('shippingAddress.city')
            .notEmpty()
            .withMessage('City is required'),
        body('shippingAddress.state')
            .notEmpty()
            .withMessage('State is required'),
        body('shippingAddress.zipCode')
            .notEmpty()
            .withMessage('ZIP code is required'),
        body('shippingAddress.country')
            .notEmpty()
            .withMessage('Country is required'),
        body('shippingAddress.phone')
            .notEmpty()
            .withMessage('Phone number is required'),
        body('paymentMethod')
            .notEmpty()
            .withMessage('Payment method is required')
            .isIn(['credit_card', 'debit_card', 'paypal', 'stripe'])
            .withMessage('Invalid payment method')
    ],

    updateOrderStatus: [
        param('id')
            .notEmpty()
            .withMessage('Order ID is required')
            .isString()
            .withMessage('Order ID must be a string'),
        body('status')
            .notEmpty()
            .withMessage('Status is required')
            .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
            .withMessage('Invalid order status')
    ],

    getOrder: [
        param('id')
            .notEmpty()
            .withMessage('Order ID is required')
            .isString()
            .withMessage('Order ID must be a string')
    ],

    getOrders: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('status')
            .optional()
            .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
            .withMessage('Invalid order status')
    ],

    getAllOrders: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('status')
            .optional()
            .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
            .withMessage('Invalid order status'),
        query('userId')
            .optional()
            .isString()
            .withMessage('User ID must be a string')
    ]
};
