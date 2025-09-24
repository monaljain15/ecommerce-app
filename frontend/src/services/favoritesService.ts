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
export interface Favorite {
    id: string;
    userId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        price: number;
        images: string[];
        brand: string;
        rating: number;
        reviewCount: number;
        stock: number;
        category: string;
    };
    createdAt: string;
}

export interface AddToFavoritesData {
    productId: string;
}

// Mock data for development
let mockFavorites: Favorite[] = [
    {
        id: 'fav-1',
        userId: 'user-1',
        productId: '1',
        product: {
            id: '1',
            name: 'Wireless Bluetooth Headphones',
            price: 199.99,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'],
            brand: 'TechSound',
            rating: 4.5,
            reviewCount: 128,
            stock: 50,
            category: 'Electronics'
        },
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'fav-2',
        userId: 'user-1',
        productId: '2',
        product: {
            id: '2',
            name: 'Smart Fitness Watch',
            price: 299.99,
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'],
            brand: 'TechWear',
            rating: 4.8,
            reviewCount: 89,
            stock: 25,
            category: 'Electronics'
        },
        createdAt: '2024-01-12T14:30:00Z'
    },
    {
        id: 'fav-3',
        userId: 'user-1',
        productId: '3',
        product: {
            id: '3',
            name: 'Premium Coffee Maker',
            price: 199.99,
            images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop'],
            brand: 'BrewMaster',
            rating: 4.2,
            reviewCount: 67,
            stock: 30,
            category: 'Home & Kitchen'
        },
        createdAt: '2024-01-10T09:15:00Z'
    }
];

export const favoritesService = {
    // Get user's favorites
    async getFavorites(userId: string): Promise<Favorite[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, filter mock data
        // In production, this would be:
        // const response = await api.get(`/users/${userId}/favorites`);
        // return response.data;

        return mockFavorites.filter(fav => fav.userId === userId);
    },

    // Add product to favorites
    async addToFavorites(data: AddToFavoritesData, userId?: string): Promise<Favorite> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, create mock favorite
        // In production, this would be:
        // const response = await api.post('/favorites', data);
        // return response.data;

        const currentUserId = userId || 'current-user-id';

        // Check if already in favorites
        const existingFavorite = mockFavorites.find(
            fav => fav.productId === data.productId && fav.userId === currentUserId
        );

        if (existingFavorite) {
            throw new Error('Product is already in favorites');
        }

        // Get product details (in real app, this would come from the API)
        const productDetails = {
            id: data.productId,
            name: 'Product Name', // This would be fetched from product service
            price: 99.99,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?w=400&h=400&fit=crop'],
            brand: 'Brand Name',
            rating: 4.5,
            reviewCount: 0,
            stock: 10,
            category: 'Electronics'
        };

        const newFavorite: Favorite = {
            id: `fav-${Date.now()}`,
            userId: currentUserId,
            productId: data.productId,
            product: productDetails,
            createdAt: new Date().toISOString()
        };

        mockFavorites.unshift(newFavorite);
        return newFavorite;
    },

    // Remove product from favorites
    async removeFromFavorites(favoriteId: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, remove from mock data
        // In production, this would be:
        // await api.delete(`/favorites/${favoriteId}`);

        const index = mockFavorites.findIndex(fav => fav.id === favoriteId);
        if (index === -1) {
            throw new Error('Favorite not found');
        }

        mockFavorites.splice(index, 1);
    },

    // Remove product from favorites by product ID
    async removeFromFavoritesByProductId(productId: string, userId?: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, remove from mock data
        // In production, this would be:
        // await api.delete(`/favorites/product/${productId}`);

        const currentUserId = userId || 'current-user-id';

        const index = mockFavorites.findIndex(
            fav => fav.productId === productId && fav.userId === currentUserId
        );

        if (index === -1) {
            throw new Error('Product not found in favorites');
        }

        mockFavorites.splice(index, 1);
    },

    // Check if product is in favorites
    async isProductFavorited(productId: string, userId: string): Promise<boolean> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // For now, check mock data
        // In production, this would be:
        // const response = await api.get(`/favorites/check/${productId}`);
        // return response.data.isFavorited;

        return mockFavorites.some(
            fav => fav.productId === productId && fav.userId === userId
        );
    },

    // Get favorites count for user
    async getFavoritesCount(userId: string): Promise<number> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // For now, count mock data
        // In production, this would be:
        // const response = await api.get(`/users/${userId}/favorites/count`);
        // return response.data.count;

        return mockFavorites.filter(fav => fav.userId === userId).length;
    },

    // Helper function to format date
    formatFavoriteDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};
