import { Request } from 'express';

// User types
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Product types
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    images?: string[];
    category: string;
    brand: string;
    stock: number;
    rating: number;
    reviewCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Cart types
export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

// Order types
export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    shippingAddress: Address;
    paymentMethod: string;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Address types
export interface Address {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Review types
export interface Review {
    id: string;
    userId: string;
    productId: string;
    orderId: string;
    rating: number;
    comment: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Payment types
export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string;
    stripePaymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';

// JWT Payload
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

// Extended Request interface
export interface AuthRequest extends Request {
    user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Pagination types
export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    [key: string]: any; // Allow additional properties like 'orders', 'products', 'reviews'
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// File upload types
export interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
}

// Email types
export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

// Stripe types
export interface StripePaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    client_secret: string;
}
