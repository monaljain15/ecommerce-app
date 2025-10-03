import express from 'express';
import { cartController } from './cartController';
import { cartValidators } from './cartValidator';
import { authMiddleware } from '../auth/authMiddleware';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', authMiddleware.authenticate, cartController.getCart);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', authMiddleware.authenticate, cartValidators.addToCart, cartController.addToCart);

// @route   PUT /api/cart/:id
// @desc    Update cart item
// @access  Private
router.put('/:id', authMiddleware.authenticate, cartValidators.updateCartItem, cartController.updateCartItem);

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/:id', authMiddleware.authenticate, cartValidators.removeFromCart, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', authMiddleware.authenticate, cartController.clearCart);

export default router;
