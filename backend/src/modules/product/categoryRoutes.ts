import * as express from 'express';
import * as categoryController from './categoryController';
import { validateQuery, validateParams } from '@/middleware/validation';
import * as productSchemas from '../../schemas/productSchemas';

const router = express.Router();

// Public routes
router.get('/',
    validateQuery(productSchemas.getCategoriesSchema),
    categoryController.getCategories
);

router.get('/tree',
    categoryController.getCategoryTree
);

router.get('/stats',
    categoryController.getCategoryStats
);

router.get('/:id',
    validateParams(productSchemas.categoryIdSchema),
    categoryController.getCategoryById
);

router.get('/slug/:slug',
    validateParams(productSchemas.categorySlugSchema),
    categoryController.getCategoryBySlug
);

export default router;
