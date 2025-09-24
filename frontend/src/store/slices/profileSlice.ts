import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService, UserProfile, UpdateProfileData, ChangePasswordData } from '../../services/userService';

interface ProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    stats: {
        totalOrders: number;
        totalSpent: number;
        memberSince: string;
        lastLogin: string;
    } | null;
}

const initialState: ProfileState = {
    profile: null,
    isLoading: false,
    isUpdating: false,
    error: null,
    stats: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const profile = await userService.getProfile();
            return profile;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (data: UpdateProfileData, { rejectWithValue }) => {
        try {
            const updatedProfile = await userService.updateProfile(data);
            return updatedProfile;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const changePassword = createAsyncThunk(
    'profile/changePassword',
    async (data: ChangePasswordData, { rejectWithValue }) => {
        try {
            await userService.changePassword(data);
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change password');
        }
    }
);

export const uploadAvatar = createAsyncThunk(
    'profile/uploadAvatar',
    async (file: File, { rejectWithValue }) => {
        try {
            const response = await userService.uploadAvatar(file);
            return response.avatarUrl;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
        }
    }
);

export const deleteAvatar = createAsyncThunk(
    'profile/deleteAvatar',
    async (_, { rejectWithValue }) => {
        try {
            await userService.deleteAvatar();
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete avatar');
        }
    }
);

export const fetchUserStats = createAsyncThunk(
    'profile/fetchUserStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await userService.getUserStats();
            return stats;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stats');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.stats = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateProfileField: (state, action: PayloadAction<{ field: string; value: any }>) => {
            if (state.profile) {
                const { field, value } = action.payload;
                if (field.startsWith('address.')) {
                    const addressField = field.split('.')[1];
                    state.profile.address = {
                        ...state.profile.address,
                        [addressField]: value,
                    };
                } else {
                    (state.profile as any)[field] = value;
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch Profile
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });

        // Change Password
        builder
            .addCase(changePassword.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isUpdating = false;
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });

        // Upload Avatar
        builder
            .addCase(uploadAvatar.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.isUpdating = false;
                if (state.profile) {
                    state.profile.avatar = action.payload;
                }
                state.error = null;
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });

        // Delete Avatar
        builder
            .addCase(deleteAvatar.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(deleteAvatar.fulfilled, (state) => {
                state.isUpdating = false;
                if (state.profile) {
                    state.profile.avatar = undefined;
                }
                state.error = null;
            })
            .addCase(deleteAvatar.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });

        // Fetch User Stats
        builder
            .addCase(fetchUserStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
                state.error = null;
            })
            .addCase(fetchUserStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProfile, clearError, updateProfileField } = profileSlice.actions;
export default profileSlice.reducer;
