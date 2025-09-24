import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reviewService, Review, ReviewSummary, CreateReviewData, UpdateReviewData } from '../../services/reviewService';
import toast from 'react-hot-toast';

interface ReviewState {
    reviews: Review[];
    reviewSummary: ReviewSummary | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    currentProductId: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    reviewSummary: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    currentProductId: null,
};

// Async Thunks
export const fetchProductReviews = createAsyncThunk(
    'reviews/fetchProductReviews',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await reviewService.getProductReviews(productId);
            return { productId, ...response };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch reviews');
        }
    }
);

export const fetchReviewSummary = createAsyncThunk(
    'reviews/fetchReviewSummary',
    async (productId: string, { rejectWithValue }) => {
        try {
            const summary = await reviewService.getProductReviewSummary(productId);
            return { productId, summary };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch review summary');
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (data: CreateReviewData, { rejectWithValue }) => {
        try {
            const review = await reviewService.createReview(data);
            toast.success('Review submitted successfully!');
            return review;
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit review');
            return rejectWithValue(error.message || 'Failed to submit review');
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ reviewId, data }: { reviewId: string; data: UpdateReviewData }, { rejectWithValue }) => {
        try {
            const review = await reviewService.updateReview(reviewId, data);
            toast.success('Review updated successfully!');
            return review;
        } catch (error: any) {
            toast.error(error.message || 'Failed to update review');
            return rejectWithValue(error.message || 'Failed to update review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (reviewId: string, { rejectWithValue }) => {
        try {
            await reviewService.deleteReview(reviewId);
            toast.success('Review deleted successfully!');
            return reviewId;
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete review');
            return rejectWithValue(error.message || 'Failed to delete review');
        }
    }
);

export const markReviewHelpful = createAsyncThunk(
    'reviews/markReviewHelpful',
    async (reviewId: string, { rejectWithValue }) => {
        try {
            const review = await reviewService.markReviewHelpful(reviewId);
            return review;
        } catch (error: any) {
            toast.error(error.message || 'Failed to mark review as helpful');
            return rejectWithValue(error.message || 'Failed to mark review as helpful');
        }
    }
);

export const checkCanReview = createAsyncThunk(
    'reviews/checkCanReview',
    async ({ productId, userId }: { productId: string; userId: string }, { rejectWithValue }) => {
        try {
            const canReview = await reviewService.canUserReviewProduct(productId, userId);
            return { productId, canReview };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to check review eligibility');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.reviewSummary = null;
            state.currentProductId = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentProduct: (state, action: PayloadAction<string>) => {
            state.currentProductId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Product Reviews
            .addCase(fetchProductReviews.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload.reviews;
                state.currentProductId = action.payload.productId;
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Fetch Review Summary
            .addCase(fetchReviewSummary.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchReviewSummary.fulfilled, (state, action) => {
                state.reviewSummary = action.payload.summary;
            })
            .addCase(fetchReviewSummary.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // Create Review
            .addCase(createReview.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.reviews.unshift(action.payload);
            })
            .addCase(createReview.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload as string;
            })

            // Update Review
            .addCase(updateReview.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.isSubmitting = false;
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload as string;
            })

            // Delete Review
            .addCase(deleteReview.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.reviews = state.reviews.filter(review => review.id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload as string;
            })

            // Mark Review Helpful
            .addCase(markReviewHelpful.pending, (state) => {
                state.error = null;
            })
            .addCase(markReviewHelpful.fulfilled, (state, action) => {
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            .addCase(markReviewHelpful.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // Check Can Review
            .addCase(checkCanReview.pending, (state) => {
                state.error = null;
            })
            .addCase(checkCanReview.fulfilled, (state, action) => {
                // This would typically be stored in a separate state or component state
                // since it's product and user specific
            })
            .addCase(checkCanReview.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearReviews, clearError, setCurrentProduct } = reviewSlice.actions;
export default reviewSlice.reducer;
