import express from 'express';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import brandRoutes from './brandRoutes';
import favoritesRoutes from './favoritesRoutes';

const router = express.Router();

// Mount all product-related routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/favorites', favoritesRoutes);

export default router;
