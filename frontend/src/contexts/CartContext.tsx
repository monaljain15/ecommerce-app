import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService } from '../services/cartService';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (product: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartQuantity: (productId: string) => number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const cartItems = await cartService.getCart();
                setItems(cartItems);
            } catch (error) {
                console.error('Failed to load cart:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    const addToCart = async (product: Omit<CartItem, 'id' | 'quantity'>) => {
        try {
            const newItem = await cartService.addToCart(product);

            // Check if item already exists in cart
            setItems(prev => {
                const existingItemIndex = prev.findIndex(item => item.productId === product.productId);

                if (existingItemIndex >= 0) {
                    // Update existing item quantity
                    const updatedItems = [...prev];
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: updatedItems[existingItemIndex].quantity + 1
                    };
                    return updatedItems;
                } else {
                    // Add new item
                    return [...prev, newItem];
                }
            });
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await cartService.removeFromCart(itemId);
            setItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            await cartService.updateQuantity(itemId, quantity);
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error('Failed to update quantity:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            setItems([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
            throw error;
        }
    };

    const getCartQuantity = (productId: string): number => {
        const item = items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    };

    const value = {
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartQuantity,
        loading
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
