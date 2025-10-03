// Auth schemas
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    verifyEmailSchema,
    refreshTokenSchema
} = require('./authSchemas');

// Product schemas
const {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
    productIdSchema
} = require('./productSchemas');

// Order schemas
const {
    createOrderSchema,
    updateOrderStatusSchema,
    orderQuerySchema,
    orderIdSchema,
    orderItemSchema,
    addressSchema
} = require('./orderSchemas');

// Cart schemas
const {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdSchema,
    bulkUpdateCartSchema
} = require('./cartSchemas');

// Review schemas
const {
    createReviewSchema,
    updateReviewSchema,
    reviewQuerySchema,
    reviewIdSchema,
    markHelpfulSchema
} = require('./reviewSchemas');

// User schemas
const {
    updateProfileSchema,
    updateAddressSchema,
    userQuerySchema,
    userIdSchema,
    addressIdSchema,
    updateUserStatusSchema,
    updateUserRoleSchema
} = require('./userSchemas');

// Payment method schemas
const {
    createPaymentMethodSchema,
    updatePaymentMethodSchema,
    paymentMethodIdSchema,
    setDefaultPaymentMethodSchema,
    paymentMethodQuerySchema,
    stripePaymentMethodSchema
} = require('./paymentMethodSchemas');

export {
    // Auth schemas
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    verifyEmailSchema,
    refreshTokenSchema,

    // Product schemas
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
    productIdSchema,

    // Order schemas
    createOrderSchema,
    updateOrderStatusSchema,
    orderQuerySchema,
    orderIdSchema,
    orderItemSchema,
    addressSchema,

    // Cart schemas
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdSchema,
    bulkUpdateCartSchema,

    // Review schemas
    createReviewSchema,
    updateReviewSchema,
    reviewQuerySchema,
    reviewIdSchema,
    markHelpfulSchema,

    // User schemas
    updateProfileSchema,
    updateAddressSchema,
    userQuerySchema,
    userIdSchema,
    addressIdSchema,
    updateUserStatusSchema,
    updateUserRoleSchema,

    // Payment method schemas
    createPaymentMethodSchema,
    updatePaymentMethodSchema,
    paymentMethodIdSchema,
    setDefaultPaymentMethodSchema,
    paymentMethodQuerySchema,
    stripePaymentMethodSchema
};
