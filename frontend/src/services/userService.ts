import axios from 'axios';
import { tokenManager } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    bio?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    bio?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UploadAvatarResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: 'user' | 'admin';
        isActive: boolean;
        emailVerified: boolean;
        lastLogin?: Date;
        createdAt?: Date;
        updatedAt?: Date;
    };
}

export interface S3UploadResponse {
    success: boolean;
    message: string;
    data: {
        uploadUrl: string;
        key: string;
        expiresIn: number;
    };
}

// Mock data for development
const mockProfile: UserProfile = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
    },
    dateOfBirth: '1990-05-15',
    gender: 'male',
    bio: 'Passionate about technology and innovation. Love exploring new places and trying different cuisines.',
    role: 'user',
    isActive: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
};

export const userService = {
    // Get user profile
    async getProfile(): Promise<UserProfile> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, return mock data
        // In production, this would be:
        // const response = await api.get('/users/profile');
        // return response.data;

        return { ...mockProfile };
    },

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, return updated mock data
        // In production, this would be:
        // const response = await api.put('/users/profile', data);
        // return response.data;

        const updatedProfile = {
            ...mockProfile,
            ...data,
            updatedAt: new Date().toISOString(),
        };

        // Update mock data for consistency
        Object.assign(mockProfile, updatedProfile);

        return updatedProfile;
    },

    // Change password
    async changePassword(data: ChangePasswordData): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, just simulate success
        // In production, this would be:
        // await api.post('/users/change-password', data);

        // Mock validation - in real app, this would validate current password
        if (!data.currentPassword) {
            throw new Error('Current password is required');
        }

        if (!data.newPassword) {
            throw new Error('New password is required');
        }

        if (data.newPassword !== data.confirmPassword) {
            throw new Error('New passwords do not match');
        }

        // Simulate success
        console.log('Password changed successfully (mock)');
    },

    // Upload profile picture
    async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    // Get S3 upload URL for direct upload
    async getS3UploadUrl(fileName: string, fileType: string): Promise<S3UploadResponse> {
        const response = await api.post('/users/avatar/upload-url', {
            fileName,
            fileType,
        });

        return response.data;
    },

    // Confirm S3 upload completion
    async confirmS3Upload(key: string): Promise<UploadAvatarResponse> {
        const response = await api.post('/users/avatar/confirm-upload', {
            key,
        });

        return response.data;
    },

    // Delete profile picture
    async deleteAvatar(): Promise<void> {
        await api.delete('/users/avatar');
    },

    // Get signed URL for avatar access
    async getAvatarSignedUrl(avatarUrl: string): Promise<{ signedUrl: string; expiresIn?: number }> {
        const response = await api.get('/users/avatar/signed-url', {
            params: { url: avatarUrl },
        });

        return response.data.data;
    },

    // Get user statistics (optional)
    async getUserStats(): Promise<{
        totalOrders: number;
        totalSpent: number;
        memberSince: string;
        lastLogin: string;
    }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, return mock stats
        // In production, this would be:
        // const response = await api.get('/users/stats');
        // return response.data;

        return {
            totalOrders: 12,
            totalSpent: 1250.75,
            memberSince: '2023-01-15',
            lastLogin: '2024-01-15T14:30:00Z',
        };
    },
};
