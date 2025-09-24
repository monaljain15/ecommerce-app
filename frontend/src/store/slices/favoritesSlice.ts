import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { favoritesService, Favorite, AddToFavoritesData } from '../../services/favoritesService';
import toast from 'react-hot-toast';

interface FavoritesState {
    favorites: Favorite[];
    favoritesCount: number;
    isLoading: boolean;
    isAdding: boolean;
    isRemoving: boolean;
    error: string | null;
}

const initialState: FavoritesState = {
    favorites: [],
    favoritesCount: 0,
    isLoading: false,
    isAdding: false,
    isRemoving: false,
    error: null,
};

// Async Thunks
export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (userId: string, { rejectWithValue }) => {
        try {
            const favorites = await favoritesService.getFavorites(userId);
            return favorites;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch favorites');
        }
    }
);

export const addToFavorites = createAsyncThunk(
    'favorites/addToFavorites',
    async (data: AddToFavoritesData, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const userId = state.auth?.user?.id;
            const favorite = await favoritesService.addToFavorites(data, userId);
            toast.success('Added to favorites!');
            return favorite;
        } catch (error: any) {
            toast.error(error.message || 'Failed to add to favorites');
            return rejectWithValue(error.message || 'Failed to add to favorites');
        }
    }
);

export const removeFromFavorites = createAsyncThunk(
    'favorites/removeFromFavorites',
    async (favoriteId: string, { rejectWithValue }) => {
        try {
            await favoritesService.removeFromFavorites(favoriteId);
            toast.success('Removed from favorites');
            return favoriteId;
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove from favorites');
            return rejectWithValue(error.message || 'Failed to remove from favorites');
        }
    }
);

export const removeFromFavoritesByProductId = createAsyncThunk(
    'favorites/removeFromFavoritesByProductId',
    async (productId: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const userId = state.auth?.user?.id;
            await favoritesService.removeFromFavoritesByProductId(productId, userId);
            toast.success('Removed from favorites');
            return productId;
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove from favorites');
            return rejectWithValue(error.message || 'Failed to remove from favorites');
        }
    }
);

export const checkIsFavorited = createAsyncThunk(
    'favorites/checkIsFavorited',
    async ({ productId, userId }: { productId: string; userId: string }, { rejectWithValue }) => {
        try {
            const isFavorited = await favoritesService.isProductFavorited(productId, userId);
            return { productId, isFavorited };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to check favorite status');
        }
    }
);

export const fetchFavoritesCount = createAsyncThunk(
    'favorites/fetchFavoritesCount',
    async (userId: string, { rejectWithValue }) => {
        try {
            const count = await favoritesService.getFavoritesCount(userId);
            return count;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch favorites count');
        }
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.favorites = [];
            state.favoritesCount = 0;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        // Optimistic update for immediate UI feedback
        toggleFavoriteOptimistic: (state, action: PayloadAction<{ productId: string; isFavorited: boolean }>) => {
            const { productId, isFavorited } = action.payload;

            if (isFavorited) {
                // Add to favorites optimistically
                const existingIndex = state.favorites.findIndex(fav => fav.productId === productId);
                if (existingIndex === -1) {
                    // Create a temporary favorite entry
                    const tempFavorite: Favorite = {
                        id: `temp-${Date.now()}`,
                        userId: 'current-user-id',
                        productId,
                        product: {
                            id: productId,
                            name: 'Loading...',
                            price: 0,
                            images: [],
                            brand: '',
                            rating: 0,
                            reviewCount: 0,
                            stock: 0,
                            category: ''
                        },
                        createdAt: new Date().toISOString()
                    };
                    state.favorites.unshift(tempFavorite);
                    state.favoritesCount += 1;
                }
            } else {
                // Remove from favorites optimistically
                const index = state.favorites.findIndex(fav => fav.productId === productId);
                if (index !== -1) {
                    state.favorites.splice(index, 1);
                    state.favoritesCount = Math.max(0, state.favoritesCount - 1);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Favorites
            .addCase(fetchFavorites.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.isLoading = false;
                state.favorites = action.payload;
                state.favoritesCount = action.payload.length;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Add to Favorites
            .addCase(addToFavorites.pending, (state) => {
                state.isAdding = true;
                state.error = null;
            })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.isAdding = false;
                // Replace temporary favorite with real one
                const tempIndex = state.favorites.findIndex(fav => fav.id.startsWith('temp-'));
                if (tempIndex !== -1) {
                    state.favorites[tempIndex] = action.payload;
                } else {
                    state.favorites.unshift(action.payload);
                }
                state.favoritesCount = state.favorites.length;
            })
            .addCase(addToFavorites.rejected, (state, action) => {
                state.isAdding = false;
                state.error = action.payload as string;
                // Remove temporary favorite on error
                const tempIndex = state.favorites.findIndex(fav => fav.id.startsWith('temp-'));
                if (tempIndex !== -1) {
                    state.favorites.splice(tempIndex, 1);
                    state.favoritesCount = Math.max(0, state.favoritesCount - 1);
                }
            })

            // Remove from Favorites
            .addCase(removeFromFavorites.pending, (state) => {
                state.isRemoving = true;
                state.error = null;
            })
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.isRemoving = false;
                state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
                state.favoritesCount = state.favorites.length;
            })
            .addCase(removeFromFavorites.rejected, (state, action) => {
                state.isRemoving = false;
                state.error = action.payload as string;
            })

            // Remove from Favorites by Product ID
            .addCase(removeFromFavoritesByProductId.pending, (state) => {
                state.isRemoving = true;
                state.error = null;
            })
            .addCase(removeFromFavoritesByProductId.fulfilled, (state, action) => {
                state.isRemoving = false;
                state.favorites = state.favorites.filter(fav => fav.productId !== action.payload);
                state.favoritesCount = state.favorites.length;
            })
            .addCase(removeFromFavoritesByProductId.rejected, (state, action) => {
                state.isRemoving = false;
                state.error = action.payload as string;
            })

            // Check is Favorited
            .addCase(checkIsFavorited.pending, (state) => {
                state.error = null;
            })
            .addCase(checkIsFavorited.fulfilled, (state, action) => {
                // This is typically used for checking individual products
                // The result can be stored in component state or used for UI updates
            })
            .addCase(checkIsFavorited.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // Fetch Favorites Count
            .addCase(fetchFavoritesCount.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchFavoritesCount.fulfilled, (state, action) => {
                state.favoritesCount = action.payload;
            })
            .addCase(fetchFavoritesCount.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearFavorites, clearError, toggleFavoriteOptimistic } = favoritesSlice.actions;
export default favoritesSlice.reducer;
