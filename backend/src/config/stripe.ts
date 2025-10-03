import Stripe from 'stripe';

// Stripe configuration
export const stripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    apiVersion: '2023-10-16' as const,
};

// Initialize Stripe instance
export const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: stripeConfig.apiVersion,
});

// Stripe webhook events we handle
export const STRIPE_WEBHOOK_EVENTS = {
    PAYMENT_METHOD_ATTACHED: 'payment_method.attached',
    PAYMENT_METHOD_DETACHED: 'payment_method.detached',
    PAYMENT_METHOD_UPDATED: 'payment_method.updated',
    CUSTOMER_CREATED: 'customer.created',
    CUSTOMER_UPDATED: 'customer.updated',
    CUSTOMER_DELETED: 'customer.deleted',
    PAYMENT_INTENT_CREATED: 'payment_intent.created',
    PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
    PAYMENT_INTENT_FAILED: 'payment_intent.failed',
} as const;

// Card brand mapping
export const CARD_BRANDS = {
    visa: 'visa',
    mastercard: 'mastercard',
    amex: 'amex',
    discover: 'discover',
    diners: 'diners',
    jcb: 'jcb',
    unionpay: 'unionpay',
} as const;

// Payment method types
export const PAYMENT_METHOD_TYPES = {
    CARD: 'card',
    BANK_ACCOUNT: 'bank_account',
} as const;

// Validation functions
export const validateStripeWebhook = (payload: string, signature: string): boolean => {
    try {
        stripe.webhooks.constructEvent(payload, signature, stripeConfig.webhookSecret);
        return true;
    } catch (error) {
        console.error('Stripe webhook validation failed:', error);
        return false;
    }
};

// Helper function to get card brand from card number
export const getCardBrand = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');

    // Visa
    if (/^4/.test(cleaned)) {
        return CARD_BRANDS.visa;
    }

    // Mastercard
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
        return CARD_BRANDS.mastercard;
    }

    // American Express
    if (/^3[47]/.test(cleaned)) {
        return CARD_BRANDS.amex;
    }

    // Discover
    if (/^6(?:011|5)/.test(cleaned)) {
        return CARD_BRANDS.discover;
    }

    // Diners Club
    if (/^3[0689]/.test(cleaned)) {
        return CARD_BRANDS.diners;
    }

    // JCB
    if (/^35/.test(cleaned)) {
        return CARD_BRANDS.jcb;
    }

    // UnionPay
    if (/^62/.test(cleaned)) {
        return CARD_BRANDS.unionpay;
    }

    return 'unknown';
};

// Helper function to validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Helper function to validate CVC
export const validateCVC = (cvc: string, cardBrand: string): boolean => {
    const cleaned = cvc.replace(/\s/g, '');

    if (cardBrand === CARD_BRANDS.amex) {
        return /^\d{4}$/.test(cleaned);
    } else {
        return /^\d{3}$/.test(cleaned);
    }
};

// Helper function to format card number for display
export const formatCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

// Helper function to mask card number
export const maskCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const last4 = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return masked + last4;
};

export default stripe;
