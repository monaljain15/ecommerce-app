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
export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export interface CreateReviewData {
    productId: string;
    rating: number;
    title: string;
    comment: string;
}

export interface UpdateReviewData {
    rating?: number;
    title?: string;
    comment?: string;
}

// Mock data for development
let mockReviews: Review[] = [
    {
        id: 'review-1',
        productId: 'prod-1',
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        rating: 5,
        title: 'Excellent quality!',
        comment: 'This product exceeded my expectations. The quality is outstanding and it arrived quickly. Highly recommended!',
        isVerifiedPurchase: true,
        helpfulCount: 12,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'review-2',
        productId: 'prod-1',
        userId: 'user-2',
        userName: 'Sarah Wilson',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        rating: 4,
        title: 'Great product',
        comment: 'Very happy with this purchase. Good value for money and works as described. Would buy again.',
        isVerifiedPurchase: true,
        helpfulCount: 8,
        createdAt: '2024-01-12T14:30:00Z',
        updatedAt: '2024-01-12T14:30:00Z'
    },
    {
        id: 'review-3',
        productId: 'prod-1',
        userId: 'user-3',
        userName: 'Mike Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        rating: 3,
        title: 'Decent product',
        comment: 'It\'s okay for the price. Nothing special but gets the job done. Could be better quality.',
        isVerifiedPurchase: false,
        helpfulCount: 3,
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-10T09:15:00Z'
    },
    {
        id: 'review-4',
        productId: 'prod-2',
        userId: 'user-4',
        userName: 'Emily Davis',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        rating: 5,
        title: 'Perfect!',
        comment: 'Absolutely love this product. The design is beautiful and the functionality is exactly what I needed.',
        isVerifiedPurchase: true,
        helpfulCount: 15,
        createdAt: '2024-01-18T16:45:00Z',
        updatedAt: '2024-01-18T16:45:00Z'
    },
    {
        id: 'review-5',
        productId: 'prod-2',
        userId: 'user-5',
        userName: 'David Brown',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        rating: 4,
        title: 'Good value',
        comment: 'Solid product with good build quality. Minor issues but overall satisfied with the purchase.',
        isVerifiedPurchase: true,
        helpfulCount: 6,
        createdAt: '2024-01-16T11:20:00Z',
        updatedAt: '2024-01-16T11:20:00Z'
    },
    {
        id: 'review-6',
        productId: 'prod-3',
        userId: 'user-6',
        userName: 'Lisa Anderson',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
        rating: 5,
        title: 'Amazing!',
        comment: 'This is exactly what I was looking for. The quality is exceptional and the customer service was great too.',
        isVerifiedPurchase: true,
        helpfulCount: 20,
        createdAt: '2024-01-20T13:10:00Z',
        updatedAt: '2024-01-20T13:10:00Z'
    },
    {
        id: 'review-7',
        productId: 'prod-3',
        userId: 'user-7',
        userName: 'Robert Taylor',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
        rating: 2,
        title: 'Not as expected',
        comment: 'The product description was misleading. Quality is poor and doesn\'t match the photos. Disappointed.',
        isVerifiedPurchase: true,
        helpfulCount: 4,
        createdAt: '2024-01-14T08:30:00Z',
        updatedAt: '2024-01-14T08:30:00Z'
    }
];

export const reviewService = {
    // Get reviews for a specific product
    async getProductReviews(productId: string, page: number = 1, limit: number = 10): Promise<{ reviews: Review[]; total: number; page: number; totalPages: number }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, filter mock data
        // In production, this would be:
        // const response = await api.get(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
        // return response.data;

        const productReviews = mockReviews.filter(review => review.productId === productId);
        const total = productReviews.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReviews = productReviews.slice(startIndex, endIndex);

        return {
            reviews: paginatedReviews,
            total,
            page,
            totalPages
        };
    },

    // Get review summary for a product
    async getProductReviewSummary(productId: string): Promise<ReviewSummary> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, calculate from mock data
        // In production, this would be:
        // const response = await api.get(`/products/${productId}/reviews/summary`);
        // return response.data;

        const productReviews = mockReviews.filter(review => review.productId === productId);

        if (productReviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            };
        }

        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        productReviews.forEach(review => {
            ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
        });

        return {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
            totalReviews: productReviews.length,
            ratingDistribution
        };
    },

    // Create a new review
    async createReview(data: CreateReviewData): Promise<Review> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, create mock review
        // In production, this would be:
        // const response = await api.post('/reviews', data);
        // return response.data;

        const newReview: Review = {
            id: `review-${Date.now()}`,
            productId: data.productId,
            userId: 'current-user-id', // In real app, get from auth context
            userName: 'Current User', // In real app, get from user profile
            userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            rating: data.rating,
            title: data.title,
            comment: data.comment,
            isVerifiedPurchase: true, // In real app, check if user purchased this product
            helpfulCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        mockReviews.unshift(newReview); // Add to beginning of array
        return newReview;
    },

    // Update a review
    async updateReview(reviewId: string, data: UpdateReviewData): Promise<Review> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, update mock data
        // In production, this would be:
        // const response = await api.put(`/reviews/${reviewId}`, data);
        // return response.data;

        const reviewIndex = mockReviews.findIndex(review => review.id === reviewId);
        if (reviewIndex === -1) {
            throw new Error('Review not found');
        }

        mockReviews[reviewIndex] = {
            ...mockReviews[reviewIndex],
            ...data,
            updatedAt: new Date().toISOString()
        };

        return mockReviews[reviewIndex];
    },

    // Delete a review
    async deleteReview(reviewId: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, remove from mock data
        // In production, this would be:
        // await api.delete(`/reviews/${reviewId}`);

        const reviewIndex = mockReviews.findIndex(review => review.id === reviewId);
        if (reviewIndex === -1) {
            throw new Error('Review not found');
        }

        mockReviews.splice(reviewIndex, 1);
    },

    // Mark review as helpful
    async markReviewHelpful(reviewId: string): Promise<Review> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // For now, update mock data
        // In production, this would be:
        // const response = await api.post(`/reviews/${reviewId}/helpful`);
        // return response.data;

        const reviewIndex = mockReviews.findIndex(review => review.id === reviewId);
        if (reviewIndex === -1) {
            throw new Error('Review not found');
        }

        mockReviews[reviewIndex].helpfulCount += 1;
        return mockReviews[reviewIndex];
    },

    // Get user's reviews
    async getUserReviews(userId: string): Promise<Review[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, filter mock data
        // In production, this would be:
        // const response = await api.get(`/users/${userId}/reviews`);
        // return response.data;

        return mockReviews.filter(review => review.userId === userId);
    },

    // Check if user can review a product
    async canUserReviewProduct(productId: string, userId: string): Promise<boolean> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // For now, return true for demo purposes
        // In real app, check if user has purchased the product and hasn't already reviewed it
        // const response = await api.get(`/products/${productId}/can-review`);
        // return response.data.canReview;

        const existingReview = mockReviews.find(review =>
            review.productId === productId && review.userId === userId
        );

        return !existingReview; // Can review if no existing review
    },

    // Helper function to format date
    formatReviewDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Helper function to get rating text
    getRatingText(rating: number): string {
        const ratingTexts = {
            5: 'Excellent',
            4: 'Good',
            3: 'Average',
            2: 'Poor',
            1: 'Very Poor'
        };
        return ratingTexts[rating as keyof typeof ratingTexts] || 'Unknown';
    }
};
