import axios from 'axios';
import { Product, ProductFilters, ProductCategory, ProductBrand, Review, PaginatedResponse } from '../types';

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

// Mock data for development
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop'
        ],
        category: 'Electronics',
        brand: 'TechSound',
        stock: 50,
        rating: 4.5,
        reviewCount: 128,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with heart rate monitor, GPS, and water resistance. Track your workouts and health metrics.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1579586337278-3f436f25d4a2?w=500&h=500&fit=crop'
        ],
        category: 'Electronics',
        brand: 'FitTech',
        stock: 30,
        rating: 4.7,
        reviewCount: 89,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
    },
    {
        id: '3',
        name: 'Premium Coffee Maker',
        description: 'Professional-grade coffee maker with programmable settings and thermal carafe. Perfect for coffee enthusiasts.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop'
        ],
        category: 'Home & Kitchen',
        brand: 'BrewMaster',
        stock: 25,
        rating: 4.3,
        reviewCount: 67,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
    },
    {
        id: '4',
        name: 'Ergonomic Office Chair',
        description: 'Comfortable ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop'
        ],
        category: 'Furniture',
        brand: 'ComfortPro',
        stock: 15,
        rating: 4.6,
        reviewCount: 45,
        createdAt: '2024-01-05T10:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z'
    },
    {
        id: '5',
        name: 'Wireless Gaming Mouse',
        description: 'High-precision wireless gaming mouse with RGB lighting and programmable buttons. Perfect for gamers.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1615663245857-ac399921dda0?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=500&h=500&fit=crop'
        ],
        category: 'Electronics',
        brand: 'GameTech',
        stock: 75,
        rating: 4.4,
        reviewCount: 156,
        createdAt: '2024-01-25T10:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z'
    },
    {
        id: '6',
        name: 'Yoga Mat Premium',
        description: 'Non-slip yoga mat with extra cushioning and carrying strap. Perfect for yoga, pilates, and fitness routines.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1506629905607-2b3a4a4b4b4b?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop'
        ],
        category: 'Sports & Fitness',
        brand: 'FlexFit',
        stock: 100,
        rating: 4.8,
        reviewCount: 203,
        createdAt: '2024-01-12T10:00:00Z',
        updatedAt: '2024-01-12T10:00:00Z'
    }
];

const mockCategories: ProductCategory[] = [
    { id: '1', name: 'Electronics', slug: 'electronics', productCount: 3 },
    { id: '2', name: 'Home & Kitchen', slug: 'home-kitchen', productCount: 1 },
    { id: '3', name: 'Furniture', slug: 'furniture', productCount: 1 },
    { id: '4', name: 'Sports & Fitness', slug: 'sports-fitness', productCount: 1 }
];

const mockBrands: ProductBrand[] = [
    { id: '1', name: 'TechSound', productCount: 1 },
    { id: '2', name: 'FitTech', productCount: 1 },
    { id: '3', name: 'BrewMaster', productCount: 1 },
    { id: '4', name: 'ComfortPro', productCount: 1 },
    { id: '5', name: 'GameTech', productCount: 1 },
    { id: '6', name: 'FlexFit', productCount: 1 }
];

const mockReviews: Review[] = [
    {
        id: '1',
        userId: 'user1',
        productId: '1',
        rating: 5,
        comment: 'Excellent sound quality and comfortable fit. Battery life is amazing!',
        userName: 'John Doe',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
    },
    {
        id: '2',
        userId: 'user2',
        productId: '1',
        rating: 4,
        comment: 'Great headphones, but the noise cancellation could be better.',
        userName: 'Jane Smith',
        createdAt: '2024-01-18T10:00:00Z',
        updatedAt: '2024-01-18T10:00:00Z'
    },
    {
        id: '3',
        userId: 'user3',
        productId: '2',
        rating: 5,
        comment: 'Perfect fitness tracker! Love all the features and the design.',
        userName: 'Mike Johnson',
        createdAt: '2024-01-22T10:00:00Z',
        updatedAt: '2024-01-22T10:00:00Z'
    }
];

// Helper function to filter products
const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category);
    }

    // Brand filter
    if (filters.brand) {
        filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
        filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.rating !== undefined) {
        filtered = filtered.filter(product => product.rating >= filters.rating!);
    }

    // Sort
    if (filters.sortBy) {
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (filters.sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'rating':
                    aValue = a.rating;
                    bValue = b.rating;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                default:
                    return 0;
            }

            if (filters.sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });
    }

    return filtered;
};

export const productService = {
    // Get all products with optional filtering
    async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const filteredProducts = filterProducts(mockProducts, filters);

        const page = filters.page || 1;
        const limit = filters.limit || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        return {
            data: paginatedProducts,
            pagination: {
                page,
                limit,
                total: filteredProducts.length,
                pages: Math.ceil(filteredProducts.length / limit)
            }
        };
    },

    // Get featured products
    async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        return mockProducts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    },

    // Get single product by ID
    async getProduct(id: string): Promise<Product> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const product = mockProducts.find(p => p.id === id);
        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    },

    // Get product categories
    async getCategories(): Promise<ProductCategory[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockCategories;
    },

    // Get product brands
    async getBrands(): Promise<ProductBrand[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockBrands;
    },

    // Get product reviews
    async getProductReviews(productId: string): Promise<Review[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockReviews.filter(review => review.productId === productId);
    },

    // Add product review
    async addProductReview(productId: string, review: Omit<Review, 'id' | 'productId' | 'createdAt' | 'updatedAt'>): Promise<Review> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const newReview: Review = {
            ...review,
            id: Date.now().toString(),
            productId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        mockReviews.push(newReview);
        return newReview;
    },

    // Search products
    async searchProducts(query: string, filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
        return this.getProducts({ ...filters, search: query });
    }
};
