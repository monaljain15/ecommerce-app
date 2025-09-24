import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';

// Types
interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    maxQuantity?: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
    error: string | null;
}

interface AddToCartData {
    productId: string;
    quantity: number;
    name?: string;
    price?: number;
    image?: string;
}

interface UpdateCartItemData {
    itemId: string;
    quantity: number;
}

// Initial state
const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: false,
    error: null,
};

// Helper functions
const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
};

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartService.getCart();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (data: AddToCartData, { rejectWithValue }) => {
        try {
            const response = await cartService.addToCart({
                productId: data.productId,
                name: data.name || '',
                price: data.price || 0,
                image: data.image || ''
            });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async (data: UpdateCartItemData, { rejectWithValue }) => {
        try {
            await cartService.updateQuantity(data.itemId, data.quantity);
            return { itemId: data.itemId, quantity: data.quantity };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId: string, { rejectWithValue }) => {
        try {
            await cartService.removeFromCart(itemId);
            return itemId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await cartService.clearCart();
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        addItemLocally: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.productId === action.payload.productId);

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            const { totalItems, totalPrice } = calculateTotals(state.items);
            state.totalItems = totalItems;
            state.totalPrice = totalPrice;
        },
        updateItemLocally: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.itemId);
            if (item) {
                item.quantity = action.payload.quantity;
                const { totalItems, totalPrice } = calculateTotals(state.items);
                state.totalItems = totalItems;
                state.totalPrice = totalPrice;
            }
        },
        removeItemLocally: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            const { totalItems, totalPrice } = calculateTotals(state.items);
            state.totalItems = totalItems;
            state.totalPrice = totalPrice;
        },
        clearCartLocally: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },
        setCartItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
            const { totalItems, totalPrice } = calculateTotals(action.payload);
            state.totalItems = totalItems;
            state.totalPrice = totalPrice;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload || [];
                const { totalItems, totalPrice } = calculateTotals(state.items);
                state.totalItems = totalItems;
                state.totalPrice = totalPrice;
                state.error = null;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                const existingItem = state.items.find(item => item.productId === action.payload.productId);

                if (existingItem) {
                    existingItem.quantity += action.payload.quantity;
                } else {
                    state.items.push(action.payload);
                }

                const { totalItems, totalPrice } = calculateTotals(state.items);
                state.totalItems = totalItems;
                state.totalPrice = totalPrice;
                state.error = null;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                const item = state.items.find(item => item.id === action.payload.itemId);
                if (item) {
                    item.quantity = action.payload.quantity;
                    const { totalItems, totalPrice } = calculateTotals(state.items);
                    state.totalItems = totalItems;
                    state.totalPrice = totalPrice;
                }
                state.error = null;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
                const { totalItems, totalPrice } = calculateTotals(state.items);
                state.totalItems = totalItems;
                state.totalPrice = totalPrice;
                state.error = null;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Clear Cart
            .addCase(clearCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.isLoading = false;
                state.items = [];
                state.totalItems = 0;
                state.totalPrice = 0;
                state.error = null;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    addItemLocally,
    updateItemLocally,
    removeItemLocally,
    clearCartLocally,
    setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
