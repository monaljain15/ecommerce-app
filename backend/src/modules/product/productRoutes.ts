import * as express from 'express';
import * as productController from './productController';
import { validateQuery, validateParams } from '@/middleware/validation';
import * as productSchemas from '../../schemas/productSchemas';

const router = express.Router();

// Public routes
router.get('/',
    validateQuery(productSchemas.getProductsSchema),
    productController.getProducts
);

router.get('/featured',
    validateQuery(productSchemas.getFeaturedProductsSchema),
    productController.getFeaturedProducts
);

router.get('/search',
    validateQuery(productSchemas.searchProductsSchema),
    productController.searchProducts
);

router.get('/stats',
    productController.getProductStats
);

router.get('/:id',
    validateParams(productSchemas.productIdSchema),
    productController.getProductById
);

router.get('/slug/:slug',
    validateParams(productSchemas.productSlugSchema),
    productController.getProductBySlug
);

router.get('/:id/related',
    validateParams(productSchemas.productIdSchema),
    validateQuery(productSchemas.getRelatedProductsSchema),
    productController.getRelatedProducts
);

router.get('/:id/stock',
    validateParams(productSchemas.productIdSchema),
    validateQuery(productSchemas.checkStockSchema),
    productController.checkProductStock
);

export default router;