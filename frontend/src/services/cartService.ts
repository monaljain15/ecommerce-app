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
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface AddToCartRequest {
    productId: string;
    name: string;
    price: number;
    image: string;
}

// Mock cart data for development
let mockCart: CartItem[] = [
    {
        id: 'cart-item-1',
        productId: 'prod1',
        name: 'Wireless Bluetooth Headphones',
        price: 99.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?w=150&h=150&fit=crop'
    },
    {
        id: 'cart-item-2',
        productId: 'prod2',
        name: 'Smart Watch Series 5',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop'
    }
];

export const cartService = {
    async getCart(): Promise<CartItem[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, return mock data
        // In production, this would be:
        // const response = await api.get('/cart');
        // return response.data;

        return [...mockCart];
    },

    async addToCart(item: AddToCartRequest): Promise<CartItem> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, use mock data
        // In production, this would be:
        // const response = await api.post('/cart', item);
        // return response.data;

        // Check if item already exists in cart
        const existingItem = mockCart.find(cartItem => cartItem.productId === item.productId);

        if (existingItem) {
            // Update quantity
            existingItem.quantity += 1;
            return existingItem;
        } else {
            // Add new item
            const newItem: CartItem = {
                id: `cart-item-${Date.now()}`,
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: 1,
                image: item.image
            };
            mockCart.push(newItem);
            return newItem;
        }
    },

    async updateQuantity(itemId: string, quantity: number): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, update mock data
        // In production, this would be:
        // await api.put(`/cart/${itemId}`, { quantity });

        const item = mockCart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                mockCart = mockCart.filter(cartItem => cartItem.id !== itemId);
            } else {
                item.quantity = quantity;
            }
        }
    },

    async removeFromCart(itemId: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, update mock data
        // In production, this would be:
        // await api.delete(`/cart/${itemId}`);

        mockCart = mockCart.filter(cartItem => cartItem.id !== itemId);
    },

    async clearCart(): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, update mock data
        // In production, this would be:
        // await api.delete('/cart');

        mockCart = [];
    },
};
