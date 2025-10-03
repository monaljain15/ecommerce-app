import { body, param, query } from 'express-validator';

export const productValidators = {
    createProduct: [
        body('name')
            .notEmpty()
            .withMessage('Product name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Product name must be between 2 and 100 characters'),
        body('description')
            .notEmpty()
            .withMessage('Product description is required')
            .isLength({ min: 10, max: 1000 })
            .withMessage('Product description must be between 10 and 1000 characters'),
        body('price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('category')
            .notEmpty()
            .withMessage('Category is required')
            .isString()
            .withMessage('Category must be a string'),
        body('brand')
            .notEmpty()
            .withMessage('Brand is required')
            .isString()
            .withMessage('Brand must be a string'),
        body('stock')
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer'),
        body('image')
            .optional()
            .isURL()
            .withMessage('Image must be a valid URL'),
        body('images')
            .optional()
            .isArray()
            .withMessage('Images must be an array'),
        body('images.*')
            .optional()
            .isURL()
            .withMessage('Each image must be a valid URL')
    ],

    updateProduct: [
        param('id')
            .notEmpty()
            .withMessage('Product ID is required')
            .isString()
            .withMessage('Product ID must be a string'),
        body('name')
            .optional()
            .isLength({ min: 2, max: 100 })
            .withMessage('Product name must be between 2 and 100 characters'),
        body('description')
            .optional()
            .isLength({ min: 10, max: 1000 })
            .withMessage('Product description must be between 10 and 1000 characters'),
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer'),
        body('image')
            .optional()
            .isURL()
            .withMessage('Image must be a valid URL'),
        body('images')
            .optional()
            .isArray()
            .withMessage('Images must be an array'),
        body('images.*')
            .optional()
            .isURL()
            .withMessage('Each image must be a valid URL')
    ],

    deleteProduct: [
        param('id')
            .notEmpty()
            .withMessage('Product ID is required')
            .isString()
            .withMessage('Product ID must be a string')
    ],

    getProduct: [
        param('id')
            .notEmpty()
            .withMessage('Product ID is required')
            .isString()
            .withMessage('Product ID must be a string')
    ],

    getProducts: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('sortBy')
            .optional()
            .isIn(['name', 'price', 'rating', 'createdAt'])
            .withMessage('Sort by must be one of: name, price, rating, createdAt'),
        query('sortOrder')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage('Sort order must be asc or desc')
    ]
};
