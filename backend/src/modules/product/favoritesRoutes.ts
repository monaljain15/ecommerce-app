import * as express from 'express';
import * as favoritesController from './favoritesController';
import { authMiddleware } from '../auth/authMiddleware';
import { validateRequest, validateParams, validateQuery } from '@/middleware/validation';
import * as productSchemas from '../../schemas/productSchemas';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// Get user's favorites
router.get('/',
    validateQuery(productSchemas.getFavoritesSchema),
    favoritesController.getFavorites
);

// Add product to favorites
router.post('/',
    validateRequest(productSchemas.addToFavoritesSchema),
    favoritesController.addToFavorites
);

// Check if product is favorited
router.get('/check/:productId',
    validateParams(productSchemas.productIdSchema),
    favoritesController.isProductFavorited
);

// Get favorites count
router.get('/count',
    favoritesController.getFavoritesCount
);

// Get favorite statistics
router.get('/stats',
    favoritesController.getFavoriteStats
);

// Remove product from favorites by favorite ID
router.delete('/:favoriteId',
    validateParams(productSchemas.favoriteIdSchema),
    favoritesController.removeFromFavorites
);

// Remove product from favorites by product ID
router.delete('/product/:productId',
    validateParams(productSchemas.productIdSchema),
    favoritesController.removeFromFavoritesByProductId
);

// Clear all favorites
router.delete('/',
    favoritesController.clearAllFavorites
);

export default router;
