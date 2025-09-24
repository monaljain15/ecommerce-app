import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Types
export interface Address {
    id?: string;
    type: 'shipping' | 'billing';
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'bank_account';
    last4: string;
    brand?: string; // visa, mastercard, etc.
    expMonth?: number;
    expYear?: number;
    isDefault: boolean;
    createdAt: string;
}

export interface PaymentIntent {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
}

export interface OrderSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    items: Array<{
        id: string;
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
}

// Mock data for development
let mockAddresses: Address[] = [
    {
        id: 'addr-1',
        type: 'shipping',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        isDefault: true
    },
    {
        id: 'addr-2',
        type: 'billing',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        isDefault: true
    }
];

let mockPaymentMethods: PaymentMethod[] = [
    {
        id: 'pm-1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expMonth: 12,
        expYear: 2025,
        isDefault: true,
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'pm-2',
        type: 'card',
        last4: '5555',
        brand: 'mastercard',
        expMonth: 8,
        expYear: 2026,
        isDefault: false,
        createdAt: '2024-02-20T14:30:00Z'
    }
];

export const paymentService = {
    // Address Management
    async getAddresses(): Promise<Address[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, return mock data
        // In production, this would be:
        // const response = await api.get('/addresses');
        // return response.data;

        return [...mockAddresses];
    },

    async saveAddress(address: Omit<Address, 'id'>): Promise<Address> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, use mock data
        // In production, this would be:
        // const response = await api.post('/addresses', address);
        // return response.data;

        const newAddress: Address = {
            ...address,
            id: `addr-${Date.now()}`
        };

        // If this is set as default, unset other defaults of the same type
        if (address.isDefault) {
            mockAddresses = mockAddresses.map(addr =>
                addr.type === address.type ? { ...addr, isDefault: false } : addr
            );
        }

        mockAddresses.push(newAddress);
        return newAddress;
    },

    async updateAddress(addressId: string, address: Partial<Address>): Promise<Address> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, update mock data
        // In production, this would be:
        // const response = await api.put(`/addresses/${addressId}`, address);
        // return response.data;

        const index = mockAddresses.findIndex(addr => addr.id === addressId);
        if (index === -1) {
            throw new Error('Address not found');
        }

        // If this is set as default, unset other defaults of the same type
        if (address.isDefault) {
            mockAddresses = mockAddresses.map(addr =>
                addr.type === mockAddresses[index].type && addr.id !== addressId
                    ? { ...addr, isDefault: false }
                    : addr
            );
        }

        mockAddresses[index] = { ...mockAddresses[index], ...address };
        return mockAddresses[index];
    },

    async deleteAddress(addressId: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, update mock data
        // In production, this would be:
        // await api.delete(`/addresses/${addressId}`);

        mockAddresses = mockAddresses.filter(addr => addr.id !== addressId);
    },

    // Payment Methods
    async getPaymentMethods(): Promise<PaymentMethod[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, return mock data
        // In production, this would be:
        // const response = await api.get('/payment-methods');
        // return response.data;

        return [...mockPaymentMethods];
    },

    async savePaymentMethod(paymentMethodData: {
        type: 'card';
        cardNumber: string;
        expMonth: number;
        expYear: number;
        cvc: string;
        name: string;
    }): Promise<PaymentMethod> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, create mock payment method
        // In production, this would create a Stripe PaymentMethod and save to backend:
        // const response = await api.post('/payment-methods', paymentMethodData);
        // return response.data;

        const newPaymentMethod: PaymentMethod = {
            id: `pm-${Date.now()}`,
            type: 'card',
            last4: paymentMethodData.cardNumber.slice(-4),
            brand: this.getCardBrand(paymentMethodData.cardNumber),
            expMonth: paymentMethodData.expMonth,
            expYear: paymentMethodData.expYear,
            isDefault: mockPaymentMethods.length === 0, // First payment method is default
            createdAt: new Date().toISOString()
        };

        // If this is set as default, unset other defaults
        if (newPaymentMethod.isDefault) {
            mockPaymentMethods = mockPaymentMethods.map(pm => ({ ...pm, isDefault: false }));
        }

        mockPaymentMethods.push(newPaymentMethod);
        return newPaymentMethod;
    },

    async deletePaymentMethod(paymentMethodId: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, update mock data
        // In production, this would be:
        // await api.delete(`/payment-methods/${paymentMethodId}`);

        mockPaymentMethods = mockPaymentMethods.filter(pm => pm.id !== paymentMethodId);
    },

    async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, update mock data
        // In production, this would be:
        // await api.put(`/payment-methods/${paymentMethodId}/default`);

        mockPaymentMethods = mockPaymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === paymentMethodId
        }));
    },

    // Payment Processing
    async createPaymentIntent(orderSummary: OrderSummary): Promise<PaymentIntent> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, return mock payment intent
        // In production, this would be:
        // const response = await api.post('/payments/create-intent', orderSummary);
        // return response.data;

        const mockPaymentIntent: PaymentIntent = {
            id: `pi_${Date.now()}`,
            clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.round(orderSummary.total * 100), // Convert to cents
            currency: 'usd',
            status: 'requires_payment_method'
        };

        return mockPaymentIntent;
    },

    async confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<{ success: boolean; orderId?: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // For now, simulate successful payment
        // In production, this would confirm the payment with Stripe:
        // const response = await api.post('/payments/confirm', { paymentIntentId, paymentMethodId });
        // return response.data;

        // Simulate 95% success rate for testing
        const success = Math.random() > 0.05;

        if (success) {
            return {
                success: true,
                orderId: `order_${Date.now()}`
            };
        } else {
            throw new Error('Payment failed. Please try again.');
        }
    },

    // Helper functions
    getCardBrand(cardNumber: string): string {
        const number = cardNumber.replace(/\s/g, '');

        if (/^4/.test(number)) return 'visa';
        if (/^5[1-5]/.test(number)) return 'mastercard';
        if (/^3[47]/.test(number)) return 'amex';
        if (/^6/.test(number)) return 'discover';

        return 'unknown';
    },

    validateCardNumber(cardNumber: string): boolean {
        const number = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(number);
    },

    validateExpiryDate(month: number, year: number): boolean {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        if (month < 1 || month > 12) return false;

        return true;
    },

    validateCVC(cvc: string, cardBrand: string): boolean {
        const length = cardBrand === 'amex' ? 4 : 3;
        return new RegExp(`^\\d{${length}}$`).test(cvc);
    }
};

// Test card numbers for development
export const TEST_CARD_NUMBERS = {
    visa: '4242424242424242',
    visaDebit: '4000056655665556',
    mastercard: '5555555555554444',
    amex: '378282246310005',
    discover: '6011111111111117',
    declined: '4000000000000002',
    requiresAuthentication: '4000002500003155',
    insufficientFunds: '4000000000009995'
};
