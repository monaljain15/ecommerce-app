import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { paymentService } from './paymentService';

export const paymentController = {
    // @route   POST /api/payments/create-intent
    // @desc    Create payment intent
    // @access  Private
    async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { orderId, amount, currency } = req.body;
            const paymentIntent = await paymentService.createPaymentIntent(orderId, amount, currency);

            res.json({
                success: true,
                data: paymentIntent
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   POST /api/payments/confirm
    // @desc    Confirm payment
    // @access  Private
    async confirmPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { paymentIntentId } = req.body;
            const payment = await paymentService.confirmPayment(paymentIntentId);

            res.json({
                success: true,
                message: 'Payment confirmed successfully',
                data: payment
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   GET /api/payments/history
    // @desc    Get payment history
    // @access  Private
    async getPaymentHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await paymentService.getPaymentHistory(userId, {
                page,
                limit
            });

            res.json({
                success: true,
                data: result.payments,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   POST /api/payments/refund
    // @desc    Process refund
    // @access  Private/Admin
    async processRefund(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { paymentId, amount, reason } = req.body;
            const refund = await paymentService.processRefund(paymentId, amount, reason);

            res.json({
                success: true,
                message: 'Refund processed successfully',
                data: refund
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   GET /api/payments/:id
    // @desc    Get payment details
    // @access  Private
    async getPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { id } = req.params;
            const payment = await paymentService.getPayment(userId, id);

            res.json({
                success: true,
                data: payment
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   POST /api/payments/webhook
    // @desc    Handle payment webhook
    // @access  Public (Stripe webhook)
    async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            const signature = req.headers['stripe-signature'] as string;
            const payload = req.body;

            await paymentService.handleWebhook(signature, payload);

            res.json({
                success: true,
                message: 'Webhook processed successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};
