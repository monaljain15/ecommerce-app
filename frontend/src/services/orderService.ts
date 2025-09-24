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
export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface OrderAddress {
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
}

export interface OrderPayment {
    method: string;
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress;
    paymentMethod: OrderPayment;
    createdAt: string;
    updatedAt: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
    notes?: string;
}

export interface CreateOrderData {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress;
    paymentMethodId: string;
}

// Mock data for development
let mockOrders: Order[] = [
    {
        id: 'order-1',
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        items: [
            {
                id: 'item-1',
                productId: 'prod-1',
                name: 'Wireless Bluetooth Headphones',
                price: 99.99,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?w=150&h=150&fit=crop'
            },
            {
                id: 'item-2',
                productId: 'prod-2',
                name: 'Smart Watch Series 5',
                price: 299.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop'
            }
        ],
        subtotal: 499.97,
        shipping: 0,
        tax: 39.99,
        total: 539.96,
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '+1 (555) 123-4567'
        },
        billingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '+1 (555) 123-4567'
        },
        paymentMethod: {
            method: 'card',
            last4: '4242',
            brand: 'visa',
            expMonth: 12,
            expYear: 2025
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        estimatedDelivery: '2024-01-25',
        trackingNumber: 'TRK123456789',
        notes: 'Delivered successfully'
    },
    {
        id: 'order-2',
        orderNumber: 'ORD-2024-002',
        status: 'shipped',
        items: [
            {
                id: 'item-3',
                productId: 'prod-3',
                name: 'Gaming Laptop',
                price: 1299.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop'
            }
        ],
        subtotal: 1299.99,
        shipping: 0,
        tax: 103.99,
        total: 1403.98,
        shippingAddress: {
            firstName: 'Jane',
            lastName: 'Smith',
            address1: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'United States',
            phone: '+1 (555) 987-6543'
        },
        billingAddress: {
            firstName: 'Jane',
            lastName: 'Smith',
            address1: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'United States',
            phone: '+1 (555) 987-6543'
        },
        paymentMethod: {
            method: 'card',
            last4: '5555',
            brand: 'mastercard',
            expMonth: 8,
            expYear: 2026
        },
        createdAt: '2024-01-18T15:30:00Z',
        updatedAt: '2024-01-22T09:15:00Z',
        estimatedDelivery: '2024-01-28',
        trackingNumber: 'TRK987654321'
    },
    {
        id: 'order-3',
        orderNumber: 'ORD-2024-003',
        status: 'processing',
        items: [
            {
                id: 'item-4',
                productId: 'prod-4',
                name: 'Wireless Mouse',
                price: 29.99,
                quantity: 3,
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&h=150&fit=crop'
            },
            {
                id: 'item-5',
                productId: 'prod-5',
                name: 'Mechanical Keyboard',
                price: 149.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop'
            }
        ],
        subtotal: 239.96,
        shipping: 9.99,
        tax: 19.99,
        total: 269.94,
        shippingAddress: {
            firstName: 'Bob',
            lastName: 'Johnson',
            address1: '789 Pine Street',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'United States',
            phone: '+1 (555) 456-7890'
        },
        billingAddress: {
            firstName: 'Bob',
            lastName: 'Johnson',
            address1: '789 Pine Street',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'United States',
            phone: '+1 (555) 456-7890'
        },
        paymentMethod: {
            method: 'card',
            last4: '1234',
            brand: 'amex',
            expMonth: 3,
            expYear: 2027
        },
        createdAt: '2024-01-20T12:45:00Z',
        updatedAt: '2024-01-20T12:45:00Z',
        estimatedDelivery: '2024-01-30'
    }
];

export const orderService = {
    // Get all orders for the current user
    async getOrders(): Promise<Order[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, return mock data
        // In production, this would be:
        // const response = await api.get('/orders');
        // return response.data;

        return [...mockOrders];
    },

    // Get a specific order by ID
    async getOrderById(orderId: string): Promise<Order> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, find in mock data
        // In production, this would be:
        // const response = await api.get(`/orders/${orderId}`);
        // return response.data;

        const order = mockOrders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        return order;
    },

    // Create a new order
    async createOrder(orderData: CreateOrderData): Promise<Order> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, create mock order
        // In production, this would be:
        // const response = await api.post('/orders', orderData);
        // return response.data;

        const newOrder: Order = {
            id: `order-${Date.now()}`,
            orderNumber: `ORD-2024-${String(mockOrders.length + 1).padStart(3, '0')}`,
            status: 'pending',
            ...orderData,
            paymentMethod: {
                method: 'card',
                last4: '4242',
                brand: 'visa',
                expMonth: 12,
                expYear: 2025
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        mockOrders.unshift(newOrder); // Add to beginning of array
        return newOrder;
    },

    // Update order status (admin only)
    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, update mock data
        // In production, this would be:
        // const response = await api.put(`/orders/${orderId}/status`, { status });
        // return response.data;

        const orderIndex = mockOrders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Order not found');
        }

        mockOrders[orderIndex] = {
            ...mockOrders[orderIndex],
            status,
            updatedAt: new Date().toISOString()
        };

        return mockOrders[orderIndex];
    },

    // Cancel an order
    async cancelOrder(orderId: string): Promise<Order> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, update mock data
        // In production, this would be:
        // const response = await api.put(`/orders/${orderId}/cancel`);
        // return response.data;

        const orderIndex = mockOrders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Order not found');
        }

        // Only allow cancellation of pending or processing orders
        if (!['pending', 'processing'].includes(mockOrders[orderIndex].status)) {
            throw new Error('Order cannot be cancelled');
        }

        mockOrders[orderIndex] = {
            ...mockOrders[orderIndex],
            status: 'cancelled',
            updatedAt: new Date().toISOString()
        };

        return mockOrders[orderIndex];
    },

    // Get order status options
    getOrderStatusOptions(): { value: OrderStatus; label: string; color: string }[] {
        return [
            { value: 'pending', label: 'Pending', color: 'yellow' },
            { value: 'processing', label: 'Processing', color: 'blue' },
            { value: 'shipped', label: 'Shipped', color: 'purple' },
            { value: 'delivered', label: 'Delivered', color: 'green' },
            { value: 'cancelled', label: 'Cancelled', color: 'red' }
        ];
    },

    // Get status color class
    getStatusColor(status: OrderStatus): string {
        const statusOptions = this.getOrderStatusOptions();
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption?.color || 'gray';
    },

    // Format order date
    formatOrderDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Calculate days since order
    getDaysSinceOrder(dateString: string): number {
        const orderDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};
