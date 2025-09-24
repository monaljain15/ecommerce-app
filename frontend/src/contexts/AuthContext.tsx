import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                setError(null);

                if (authService.isAuthenticated()) {
                    const storedToken = authService.getStoredToken();
                    if (storedToken) {
                        try {
                            const userData = await authService.getProfile();
                            setUser(userData);
                            setToken(storedToken);
                        } catch (error) {
                            console.warn('Failed to get user profile:', error);
                            authService.clearAuth();
                            setUser(null);
                            setToken(null);
                        }
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setError('Failed to initialize authentication');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login({ email, password });
            setUser(response.user);
            setToken(response.token);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.register({ name, email, password });
            setUser(response.user);
            setToken(response.token);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
        } catch (error) {
            console.warn('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            setError(null);
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await authService.refreshToken();
            setToken(response.token);
        } catch (error) {
            console.warn('Token refresh failed:', error);
            await logout();
        }
    };

    const isAuthenticated = user !== null && token !== null;

    const value = {
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        refreshToken,
        loading,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
