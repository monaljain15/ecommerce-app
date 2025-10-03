import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { orderService } from './orderService';

export const orderController = {
    // @route   GET /api/orders
    // @desc    Get user orders
    // @access  Private
    async getOrders(req: Request, res: Response, next: NextFunction) {
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
            const status = req.query.status as string;

            const result = await orderService.getOrders(userId, {
                page,
                limit,
                status
            });

            res.json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   GET /api/orders/:id
    // @desc    Get single order
    // @access  Private
    async getOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { id } = req.params;
            const order = await orderService.getOrder(userId, id);

            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   POST /api/orders
    // @desc    Create new order
    // @access  Private
    async createOrder(req: Request, res: Response, next: NextFunction) {
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

            const orderData = req.body;
            const order = await orderService.createOrder(userId, orderData);

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   PUT /api/orders/:id/status
    // @desc    Update order status
    // @access  Private/Admin
    async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const { status } = req.body;
            const order = await orderService.updateOrderStatus(id, status);

            res.json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   PUT /api/orders/:id/cancel
    // @desc    Cancel order
    // @access  Private
    async cancelOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { id } = req.params;
            const order = await orderService.cancelOrder(userId, id);

            res.json({
                success: true,
                message: 'Order cancelled successfully',
                data: order
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   GET /api/orders/admin/all
    // @desc    Get all orders (Admin only)
    // @access  Private/Admin
    async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;
            const userId = req.query.userId as string;

            const result = await orderService.getAllOrders({
                page,
                limit,
                status,
                userId
            });

            res.json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }
};
