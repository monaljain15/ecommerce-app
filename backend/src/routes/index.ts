import express from 'express';

// Import all module routes
import authRoutes from '../modules/auth/authRoutes';
import userRoutes from '../modules/user/userRoutes';
import productRoutes from '../modules/product';
// Temporarily comment out problematic modules
// import cartRoutes from '../modules/cart/cartRoutes';
// import orderRoutes from '../modules/order/orderRoutes';
// import paymentRoutes from '../modules/payment/paymentRoutes';
// import reviewRoutes from '../modules/review/reviewRoutes';

const router = express.Router();

// Mount all feature routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/', productRoutes);
// Temporarily comment out problematic modules
// router.use('/cart', cartRoutes);
// router.use('/orders', orderRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/reviews', reviewRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
    res.json({
        message: 'Ecommerce API Documentation',
        version: '1.0.0',
        endpoints: {
            auth: {
                base: '/api/auth',
                routes: [
                    'POST /register - Register new user',
                    'POST /login - User login',
                    'POST /logout - User logout',
                    'POST /forgot-password - Request password reset',
                    'POST /reset-password - Reset password',
                    'POST /refresh-token - Refresh access token'
                ]
            },
            users: {
                base: '/api/users',
                routes: [
                    'GET /profile - Get user profile',
                    'PUT /profile - Update user profile',
                    'PUT /change-password - Change user password',
                    'POST /upload-avatar - Upload user avatar',
                    'GET / - Get all users (Admin)',
                    'PUT /:id/status - Update user status (Admin)',
                    'GET /addresses - Get user addresses',
                    'POST /addresses - Create user address',
                    'PUT /addresses/:id - Update user address',
                    'DELETE /addresses/:id - Delete user address',
                    'GET /payment-methods - Get user payment methods',
                    'POST /payment-methods - Create payment method',
                    'PUT /payment-methods/:id - Update payment method',
                    'DELETE /payment-methods/:id - Delete payment method',
                    'PUT /payment-methods/:id/default - Set default payment method'
                ]
            },
            cart: {
                base: '/api/cart',
                routes: [
                    'GET / - Get user cart',
                    'POST / - Add item to cart',
                    'PUT /:id - Update cart item',
                    'DELETE /:id - Remove item from cart',
                    'DELETE / - Clear cart'
                ]
            },
            products: {
                base: '/api/products',
                routes: [
                    'GET / - Get all products with filtering and pagination',
                    'GET /featured - Get featured products',
                    'GET /search - Search products',
                    'GET /stats - Get product statistics',
                    'GET /:id - Get single product by ID',
                    'GET /slug/:slug - Get single product by slug',
                    'GET /:id/related - Get related products',
                    'GET /:id/stock - Check product stock'
                ]
            },
            categories: {
                base: '/api/categories',
                routes: [
                    'GET / - Get all categories',
                    'GET /tree - Get category tree (hierarchical)',
                    'GET /stats - Get category statistics',
                    'GET /:id - Get single category by ID',
                    'GET /slug/:slug - Get single category by slug'
                ]
            },
            brands: {
                base: '/api/brands',
                routes: [
                    'GET / - Get all brands',
                    'GET /stats - Get brand statistics',
                    'GET /:id - Get single brand by ID',
                    'GET /slug/:slug - Get single brand by slug'
                ]
            },
            favorites: {
                base: '/api/favorites',
                routes: [
                    'GET / - Get user favorites (Auth required)',
                    'POST / - Add product to favorites (Auth required)',
                    'GET /check/:productId - Check if product is favorited (Auth required)',
                    'GET /count - Get favorites count (Auth required)',
                    'GET /stats - Get favorite statistics (Auth required)',
                    'DELETE /:favoriteId - Remove favorite by ID (Auth required)',
                    'DELETE /product/:productId - Remove favorite by product ID (Auth required)',
                    'DELETE / - Clear all favorites (Auth required)'
                ]
            },
            orders: {
                base: '/api/orders',
                routes: [
                    'GET / - Get user orders',
                    'GET /:id - Get single order',
                    'POST / - Create new order',
                    'PUT /:id/status - Update order status (Admin)',
                    'PUT /:id/cancel - Cancel order',
                    'GET /admin/all - Get all orders (Admin)'
                ]
            },
            payments: {
                base: '/api/payments',
                routes: [
                    'POST /create-intent - Create payment intent',
                    'POST /confirm - Confirm payment',
                    'POST /refund - Process refund (Admin)',
                    'POST /webhook - Handle payment webhook',
                    'GET /history - Get payment history',
                    'GET /:id - Get payment details'
                ]
            },
            reviews: {
                base: '/api/reviews',
                routes: [
                    'GET /:productId - Get product reviews',
                    'GET /stats/:productId - Get review statistics',
                    'GET /user/:userId - Get user reviews',
                    'POST / - Create review',
                    'PUT /:id - Update review',
                    'DELETE /:id - Delete review'
                ]
            }
        }
    });
});

export default router;
