import express from 'express';
import { orderController } from './orderController';
import { orderValidators } from './orderValidator';
import { authMiddleware } from '../auth/authMiddleware';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', authMiddleware.authenticate, orderValidators.getOrders, orderController.getOrders);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', authMiddleware.authenticate, authMiddleware.authorize('admin'), orderValidators.getAllOrders, orderController.getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authMiddleware.authenticate, orderValidators.getOrder, orderController.getOrder);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', authMiddleware.authenticate, orderValidators.createOrder, orderController.createOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', authMiddleware.authenticate, authMiddleware.authorize('admin'), orderValidators.updateOrderStatus, orderController.updateOrderStatus);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', authMiddleware.authenticate, orderController.cancelOrder);

export default router;
