import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { cartService } from './cartService';

export const cartController = {
    // @route   GET /api/cart
    // @desc    Get user cart
    // @access  Private
    async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const cart = await cartService.getCart(userId);

            res.json({
                success: true,
                data: cart
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   POST /api/cart
    // @desc    Add item to cart
    // @access  Private
    async addToCart(req: Request, res: Response, next: NextFunction) {
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

            const { productId, quantity } = req.body;
            const cartItem = await cartService.addToCart(userId, productId, quantity);

            res.status(201).json({
                success: true,
                message: 'Item added to cart successfully',
                data: cartItem
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   PUT /api/cart/:id
    // @desc    Update cart item
    // @access  Private
    async updateCartItem(req: Request, res: Response, next: NextFunction) {
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

            const { id } = req.params;
            const { quantity } = req.body;
            const cartItem = await cartService.updateCartItem(userId, id, quantity);

            res.json({
                success: true,
                message: 'Cart item updated successfully',
                data: cartItem
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   DELETE /api/cart/:id
    // @desc    Remove item from cart
    // @access  Private
    async removeFromCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { id } = req.params;
            await cartService.removeFromCart(userId, id);

            res.json({
                success: true,
                message: 'Item removed from cart successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    // @route   DELETE /api/cart
    // @desc    Clear cart
    // @access  Private
    async clearCart(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            await cartService.clearCart(userId);

            res.json({
                success: true,
                message: 'Cart cleared successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};
