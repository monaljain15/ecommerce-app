import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management utilities
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    setTokens: (token: string, refreshToken?: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    },
    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    isTokenExpired: (token: string): boolean => {
        try {
            // Handle mock tokens (for development)
            if (token.startsWith('mock-jwt-token-')) {
                // Mock tokens don't expire for development
                return false;
            }

            // Handle real JWT tokens (for production)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
};

// Add token to requests
api.interceptors.request.use((config) => {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401 responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = tokenManager.getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await api.post('/auth/refresh', { refreshToken });
                    const { token } = response.data;
                    tokenManager.setTokens(token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    tokenManager.clearTokens();
                    window.location.href = '/login';
                }
            } else {
                tokenManager.clearTokens();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    refreshToken?: string;
    user: {
        id: string;
        name: string;
        email: string;
        role?: string;
        isActive?: boolean;
        createdAt?: string;
        updatedAt?: string;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Mock data for development
const mockUsers: { [key: string]: any } = {
    // Pre-populated test users
    'test@example.com': {
        id: 'user-test-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!',
        role: 'user',
        isActive: true,
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
    },
    'admin@example.com': {
        id: 'user-admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin123!',
        role: 'admin',
        isActive: true,
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
    }
};

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, use mock data
        // In production, this would be:
        // const response = await api.post('/auth/login', credentials);
        // const data = response.data;

        // Debug logging
        console.log('Login attempt:', { email: credentials.email, password: credentials.password });
        console.log('Available users:', Object.keys(mockUsers));
        console.log('User data:', mockUsers[credentials.email]);

        // Mock login validation
        const user = mockUsers[credentials.email];
        if (!user) {
            console.log('User not found for email:', credentials.email);
            throw new Error('Invalid email or password');
        }

        if (user.password !== credentials.password) {
            console.log('Password mismatch. Expected:', user.password, 'Got:', credentials.password);
            throw new Error('Invalid email or password');
        }

        const mockResponse: AuthResponse = {
            success: true,
            message: 'Login successful',
            token: `mock-jwt-token-${Date.now()}`,
            refreshToken: `mock-refresh-token-${Date.now()}`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                isActive: user.isActive ?? true,
                createdAt: user.createdAt || new Date().toISOString(),
                updatedAt: user.updatedAt || new Date().toISOString(),
            }
        };

        // Store tokens in localStorage
        if (mockResponse.token) {
            tokenManager.setTokens(mockResponse.token, mockResponse.refreshToken);
        }

        return mockResponse;
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, use mock data
        // In production, this would be:
        // const response = await api.post('/auth/register', userData);
        // const data = response.data;

        // Mock registration validation
        if (mockUsers[userData.email]) {
            throw new Error('User with this email already exists');
        }

        const newUser = {
            id: `user-${Date.now()}`,
            name: userData.name,
            email: userData.email,
            password: userData.password, // In real app, this would be hashed
            role: 'user',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Store user in mock database
        mockUsers[userData.email] = newUser;
        console.log('User registered and stored:', newUser);
        console.log('Updated mockUsers:', Object.keys(mockUsers));

        const mockResponse: AuthResponse = {
            success: true,
            message: 'Registration successful',
            token: `mock-jwt-token-${Date.now()}`,
            refreshToken: `mock-refresh-token-${Date.now()}`,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isActive: newUser.isActive,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            }
        };

        // Store tokens in localStorage
        if (mockResponse.token) {
            tokenManager.setTokens(mockResponse.token, mockResponse.refreshToken);
        }

        return mockResponse;
    },

    async logout(): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, just clear local tokens
        // In production, this would be:
        // try {
        //     await api.post('/auth/logout');
        // } catch (error) {
        //     console.warn('Logout API call failed:', error);
        // }

        // Always clear local tokens
        tokenManager.clearTokens();
    },

    async getProfile(): Promise<User> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For now, return mock profile
        // In production, this would be:
        // const response = await api.get('/users/profile');
        // return response.data;

        const token = tokenManager.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        // In a real app, you'd decode the JWT to get user info
        // For now, return a mock user
        return {
            id: 'user-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'user',
            isActive: true,
            createdAt: '2023-01-15T10:00:00Z',
            updatedAt: '2024-01-15T14:30:00Z',
        };
    },

    async refreshToken(): Promise<{ token: string; refreshToken?: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // For now, generate new mock tokens
        // In production, this would be:
        // const response = await api.post('/auth/refresh', { refreshToken });
        // const data = response.data;

        const newToken = `mock-jwt-token-${Date.now()}`;
        const newRefreshToken = `mock-refresh-token-${Date.now()}`;

        // Update stored tokens
        tokenManager.setTokens(newToken, newRefreshToken);

        return {
            token: newToken,
            refreshToken: newRefreshToken
        };
    },

    async forgotPassword(email: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, just simulate success
        // In production, this would be:
        // await api.post('/auth/forgot-password', { email });

        console.log(`Password reset email sent to ${email} (mock)`);
    },

    async resetPassword(token: string, password: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, just simulate success
        // In production, this would be:
        // await api.post('/auth/reset-password', { token, password });

        console.log('Password reset successful (mock)');
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, just simulate success
        // In production, this would be:
        // await api.post('/auth/change-password', { currentPassword, newPassword });

        console.log('Password changed successfully (mock)');
    },

    async verifyEmail(token: string): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, just simulate success
        // In production, this would be:
        // await api.post('/auth/verify-email', { token });

        console.log('Email verified successfully (mock)');
    },

    async resendVerificationEmail(): Promise<void> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, just simulate success
        // In production, this would be:
        // await api.post('/auth/resend-verification');

        console.log('Verification email resent (mock)');
    },

    // Utility methods
    isAuthenticated(): boolean {
        const token = tokenManager.getToken();
        return token ? !tokenManager.isTokenExpired(token) : false;
    },

    getStoredToken(): string | null {
        return tokenManager.getToken();
    },

    clearAuth(): void {
        tokenManager.clearTokens();
    }
};
