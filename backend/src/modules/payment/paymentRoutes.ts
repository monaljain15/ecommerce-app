import express from 'express';
import { paymentController } from './paymentController';
import { paymentValidators } from './paymentValidator';
import { authMiddleware } from '../auth/authMiddleware';

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-intent', authMiddleware.authenticate, paymentValidators.createPaymentIntent, paymentController.createPaymentIntent);

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', authMiddleware.authenticate, paymentValidators.confirmPayment, paymentController.confirmPayment);

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private/Admin
router.post('/refund', authMiddleware.authenticate, authMiddleware.authorize('admin'), paymentValidators.processRefund, paymentController.processRefund);

// @route   POST /api/payments/webhook
// @desc    Handle payment webhook
// @access  Public (Stripe webhook)
router.post('/webhook', paymentController.handleWebhook);

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', authMiddleware.authenticate, paymentValidators.getPaymentHistory, paymentController.getPaymentHistory);

// @route   GET /api/payments/:id
// @desc    Get payment details
// @access  Private
router.get('/:id', authMiddleware.authenticate, paymentValidators.getPayment, paymentController.getPayment);

export default router;
