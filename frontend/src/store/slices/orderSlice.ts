import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface OrderItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Address {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: Address;
    paymentMethod: string;
    paymentId?: string;
    createdAt: string;
    updatedAt: string;
}

interface OrderFilters {
    page?: number;
    limit?: number;
    status?: string;
}

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    filters: OrderFilters;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    isLoading: boolean;
    error: string | null;
}

interface CreateOrderData {
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod: string;
}

// Initial state
const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    filters: {
        page: 1,
        limit: 10,
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (filters: OrderFilters = {}, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await orderService.getOrders(filters);
            // return response.data;

            // Mock response for now
            return {
                orders: [],
                pagination: {
                    page: filters.page || 1,
                    limit: filters.limit || 10,
                    total: 0,
                    pages: 0,
                },
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrder = createAsyncThunk(
    'order/fetchOrder',
    async (orderId: string, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await orderService.getOrder(orderId);
            // return response.data;

            // Mock response for now
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData: CreateOrderData, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await orderService.createOrder(orderData);
            // return response.data;

            // Mock response for now
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async (orderId: string, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await orderService.cancelOrder(orderId);
            // return response.data;

            // Mock response for now
            return { orderId, status: 'cancelled' };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
        }
    }
);

// Order slice
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                page: 1,
                limit: 10,
            };
        },
        setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
            state.currentOrder = action.payload;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }>) => {
            const order = state.orders.find(o => o.id === action.payload.orderId);
            if (order) {
                order.status = action.payload.status as Order['status'];
            }
            if (state.currentOrder?.id === action.payload.orderId) {
                state.currentOrder.status = action.payload.status as Order['status'];
            }
        },
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            state.orders.unshift(action.payload);
        },
        updateOrder: (state, action: PayloadAction<Order>) => {
            const index = state.orders.findIndex(o => o.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
            if (state.currentOrder?.id === action.payload.id) {
                state.currentOrder = action.payload;
            }
        },
        removeOrder: (state, action: PayloadAction<string>) => {
            state.orders = state.orders.filter(o => o.id !== action.payload);
            if (state.currentOrder?.id === action.payload) {
                state.currentOrder = null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.orders;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Order
            .addCase(fetchOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
                state.error = null;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.orders.unshift(action.payload);
                    state.currentOrder = action.payload;
                }
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Cancel Order
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                const order = state.orders.find(o => o.id === action.payload.orderId);
                if (order) {
                    order.status = action.payload.status as Order['status'];
                }
                if (state.currentOrder?.id === action.payload.orderId) {
                    state.currentOrder.status = action.payload.status as Order['status'];
                }
                state.error = null;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    setFilters,
    clearFilters,
    setCurrentOrder,
    clearCurrentOrder,
    updateOrderStatus,
    setOrders,
    addOrder,
    updateOrder,
    removeOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
