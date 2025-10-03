import { Router } from 'express';
import {
    getPaymentMethods,
    getPaymentMethod,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    getPaymentMethodStats
} from './paymentMethodController';
import { authMiddleware } from '../../auth/authMiddleware';
import {
    checkPaymentMethodOwnership,
    checkPaymentMethodModification,
    checkPaymentMethodLimits,
    validateCardData,
    ensureDefaultPaymentMethod
} from './paymentMethodMiddleware';
import {
    createPaymentMethodSchema,
    updatePaymentMethodSchema,
    paymentMethodIdSchema,
    setDefaultPaymentMethodSchema,
    paymentMethodQuerySchema
} from '../../../schemas/paymentMethodSchemas';

const router = Router();

// Validation middleware
const validateRequest = (schema: any) => (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

const validateParams = (schema: any) => (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

const validateQuery = (schema: any) => (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// All routes require authentication
router.use(authMiddleware.authenticate);

// GET /api/users/payment-methods - Get all payment methods for user
router.get(
    '/',
    validateQuery(paymentMethodQuerySchema),
    getPaymentMethods
);

// GET /api/users/payment-methods/stats - Get payment method statistics
router.get(
    '/stats',
    getPaymentMethodStats
);

// GET /api/users/payment-methods/:id - Get single payment method
router.get(
    '/:id',
    validateParams(paymentMethodIdSchema),
    checkPaymentMethodOwnership,
    getPaymentMethod
);

// POST /api/users/payment-methods - Create new payment method
router.post(
    '/',
    validateRequest(createPaymentMethodSchema),
    validateCardData,
    checkPaymentMethodLimits,
    createPaymentMethod
);

// PUT /api/users/payment-methods/:id - Update payment method
router.put(
    '/:id',
    validateParams(paymentMethodIdSchema),
    validateRequest(updatePaymentMethodSchema),
    checkPaymentMethodOwnership,
    checkPaymentMethodModification,
    updatePaymentMethod
);

// PUT /api/users/payment-methods/:id/default - Set as default payment method
router.put(
    '/:id/default',
    validateParams(paymentMethodIdSchema),
    validateRequest(setDefaultPaymentMethodSchema),
    checkPaymentMethodOwnership,
    checkPaymentMethodModification,
    setDefaultPaymentMethod
);

// DELETE /api/users/payment-methods/:id - Delete payment method
router.delete(
    '/:id',
    validateParams(paymentMethodIdSchema),
    checkPaymentMethodOwnership,
    ensureDefaultPaymentMethod,
    deletePaymentMethod
);

export default router;
