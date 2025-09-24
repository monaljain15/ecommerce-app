import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface Product {
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
    createdAt: string;
    updatedAt: string;
}

interface ProductFilters {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
}

interface ProductState {
    products: Product[];
    currentProduct: Product | null;
    categories: string[];
    brands: string[];
    filters: ProductFilters;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    isLoading: boolean;
    error: string | null;
}

// Initial state
const initialState: ProductState = {
    products: [],
    currentProduct: null,
    categories: [],
    brands: [],
    filters: {
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
    },
    isLoading: false,
    error: null,
};

// Async thunks (these would typically call your API service)
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (filters: ProductFilters = {}, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await productService.getProducts(filters);
            // return response.data;

            // Mock response for now
            return {
                products: [],
                pagination: {
                    page: filters.page || 1,
                    limit: filters.limit || 12,
                    total: 0,
                    pages: 0,
                },
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchProduct = createAsyncThunk(
    'product/fetchProduct',
    async (productId: string, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await productService.getProduct(productId);
            // return response.data;

            // Mock response for now
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'product/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await productService.getCategories();
            // return response.data;

            // Mock response for now
            return [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const fetchBrands = createAsyncThunk(
    'product/fetchBrands',
    async (_, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await productService.getBrands();
            // return response.data;

            // Mock response for now
            return [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
        }
    }
);

export const searchProducts = createAsyncThunk(
    'product/searchProducts',
    async (searchTerm: string, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await productService.searchProducts(searchTerm);
            // return response.data;

            // Mock response for now
            return {
                products: [],
                pagination: {
                    page: 1,
                    limit: 12,
                    total: 0,
                    pages: 0,
                },
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search products');
        }
    }
);

// Product slice
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                page: 1,
                limit: 12,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            };
        },
        setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
            state.currentProduct = action.payload;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
        updateProductStock: (state, action: PayloadAction<{ productId: string; stock: number }>) => {
            const product = state.products.find(p => p.id === action.payload.productId);
            if (product) {
                product.stock = action.payload.stock;
            }
            if (state.currentProduct?.id === action.payload.productId) {
                state.currentProduct.stock = action.payload.stock;
            }
        },
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.unshift(action.payload);
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
            if (state.currentProduct?.id === action.payload.id) {
                state.currentProduct = action.payload;
            }
        },
        removeProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
            if (state.currentProduct?.id === action.payload) {
                state.currentProduct = null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.products;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Product
            .addCase(fetchProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentProduct = action.payload;
                state.error = null;
            })
            .addCase(fetchProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Brands
            .addCase(fetchBrands.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.isLoading = false;
                state.brands = action.payload;
                state.error = null;
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Search Products
            .addCase(searchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.products;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    setFilters,
    clearFilters,
    setCurrentProduct,
    clearCurrentProduct,
    updateProductStock,
    setProducts,
    addProduct,
    updateProduct,
    removeProduct,
} = productSlice.actions;

export default productSlice.reducer;
