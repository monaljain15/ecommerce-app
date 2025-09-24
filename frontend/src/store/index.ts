import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';
import orderSlice from './slices/orderSlice';
import profileSlice from './slices/profileSlice';
import reviewSlice from './slices/reviewSlice';
import favoritesSlice from './slices/favoritesSlice';
import uiSlice from './slices/uiSlice';

// Persist config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart', 'favorites'], // Persist auth, cart, and favorites
};

// Root reducer
const rootReducer = combineReducers({
    auth: authSlice,
    cart: cartSlice,
    product: productSlice,
    order: orderSlice,
    profile: profileSlice,
    review: reviewSlice,
    favorites: favoritesSlice,
    ui: uiSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
