import { Request, Response, NextFunction } from 'express';
import { orderService } from './orderService';

export const orderMiddleware = {
    // Middleware to check if order exists and belongs to user
    async checkOrderOwnership(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const orderId = req.params.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            // TODO: Implement database check to verify order belongs to user
            // const order = await orderService.getOrder(userId, orderId);
            // if (!order) {
            //     return res.status(404).json({
            //         success: false,
            //         message: 'Order not found or does not belong to user'
            //     });
            // }

            // req.order = order;
            next();
        } catch (error) {
            next(error);
        }
    },

    // Middleware to check if order can be cancelled
    async checkOrderCancellable(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.id;

            // TODO: Implement check to verify order can be cancelled
            // const order = await orderService.getOrderById(orderId);
            // if (!order || !['pending', 'processing'].includes(order.status)) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Order cannot be cancelled'
            //     });
            // }

            next();
        } catch (error) {
            next(error);
        }
    },

    // Middleware to validate order items before creation
    async validateOrderItems(req: Request, res: Response, next: NextFunction) {
        try {
            const { items } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Order must contain at least one item'
                });
            }

            // TODO: Implement validation for each order item
            // - Check if products exist and are active
            // - Check stock availability
            // - Validate quantities

            next();
        } catch (error) {
            next(error);
        }
    },

    // Middleware to add order statistics to response
    async addOrderStats(req: Request, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && req.user?.id) {
                    // TODO: Add order statistics to response
                    // const orderStats = await orderService.getOrderStats(req.user.id);
                    // data.orderStats = orderStats;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            next(error);
        }
    },

    // Middleware to check order status transition validity
    async validateStatusTransition(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.body;
            const orderId = req.params.id;

            // TODO: Implement status transition validation
            // const order = await orderService.getOrderById(orderId);
            // const validTransitions = getValidStatusTransitions(order.status);
            // if (!validTransitions.includes(status)) {
            //     return res.status(400).json({
            //         success: false,
            //         message: `Cannot transition from ${order.status} to ${status}`
            //     });
            // }

            next();
        } catch (error) {
            next(error);
        }
    },

    // Middleware to add shipping information to order response
    async addShippingInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const originalJson = res.json;

            res.json = function (data: any) {
                if (data.success && data.data && data.data.id) {
                    // TODO: Add shipping information to order response
                    // const shippingInfo = await orderService.getShippingInfo(data.data.id);
                    // data.data.shippingInfo = shippingInfo;
                }
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            next(error);
        }
    }
};
