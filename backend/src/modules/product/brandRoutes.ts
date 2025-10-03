import * as express from 'express';
import * as brandController from './brandController';
import { validateQuery, validateParams } from '@/middleware/validation';
import * as productSchemas from '../../schemas/productSchemas';

const router = express.Router();

// Public routes
router.get('/',
    validateQuery(productSchemas.getBrandsSchema),
    brandController.getBrands
);

router.get('/stats',
    brandController.getBrandStats
);

router.get('/:id',
    validateParams(productSchemas.brandIdSchema),
    brandController.getBrandById
);

router.get('/slug/:slug',
    validateParams(productSchemas.brandSlugSchema),
    brandController.getBrandBySlug
);

export default router;
