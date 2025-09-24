import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    timestamp: number;
}

interface Modal {
    id: string;
    type: string;
    isOpen: boolean;
    data?: any;
}

interface UIState {
    // Loading states
    isLoading: boolean;
    loadingMessage: string | null;

    // Navigation
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;

    // Notifications
    notifications: Notification[];

    // Modals
    modals: Modal[];

    // Theme
    theme: 'light' | 'dark' | 'system';

    // Search
    searchQuery: string;
    searchOpen: boolean;

    // Filters
    filtersOpen: boolean;

    // Pagination
    currentPage: number;
    itemsPerPage: number;

    // Error states
    globalError: string | null;

    // Success states
    globalSuccess: string | null;
}

// Initial state
const initialState: UIState = {
    // Loading states
    isLoading: false,
    loadingMessage: null,

    // Navigation
    sidebarOpen: false,
    mobileMenuOpen: false,

    // Notifications
    notifications: [],

    // Modals
    modals: [],

    // Theme
    theme: 'system',

    // Search
    searchQuery: '',
    searchOpen: false,

    // Filters
    filtersOpen: false,

    // Pagination
    currentPage: 1,
    itemsPerPage: 12,

    // Error states
    globalError: null,

    // Success states
    globalSuccess: null,
};

// UI slice
const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Loading actions
        setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
            state.isLoading = action.payload.isLoading;
            state.loadingMessage = action.payload.message || null;
        },
        clearLoading: (state) => {
            state.isLoading = false;
            state.loadingMessage = null;
        },

        // Navigation actions
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
            state.mobileMenuOpen = action.payload;
        },
        closeAllMenus: (state) => {
            state.sidebarOpen = false;
            state.mobileMenuOpen = false;
        },

        // Notification actions
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        clearOldNotifications: (state) => {
            const now = Date.now();
            state.notifications = state.notifications.filter(n => now - n.timestamp < 30000); // Keep notifications for 30 seconds
        },

        // Modal actions
        openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
            const modal: Modal = {
                id: Date.now().toString(),
                type: action.payload.type,
                isOpen: true,
                data: action.payload.data,
            };
            state.modals.push(modal);
        },
        closeModal: (state, action: PayloadAction<string>) => {
            const modal = state.modals.find(m => m.id === action.payload);
            if (modal) {
                modal.isOpen = false;
            }
        },
        removeModal: (state, action: PayloadAction<string>) => {
            state.modals = state.modals.filter(m => m.id !== action.payload);
        },
        closeAllModals: (state) => {
            state.modals.forEach(modal => {
                modal.isOpen = false;
            });
        },

        // Theme actions
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
            state.theme = action.payload;
        },
        toggleTheme: (state) => {
            if (state.theme === 'light') {
                state.theme = 'dark';
            } else if (state.theme === 'dark') {
                state.theme = 'system';
            } else {
                state.theme = 'light';
            }
        },

        // Search actions
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = '';
        },
        toggleSearch: (state) => {
            state.searchOpen = !state.searchOpen;
        },
        setSearchOpen: (state, action: PayloadAction<boolean>) => {
            state.searchOpen = action.payload;
        },

        // Filter actions
        toggleFilters: (state) => {
            state.filtersOpen = !state.filtersOpen;
        },
        setFiltersOpen: (state, action: PayloadAction<boolean>) => {
            state.filtersOpen = action.payload;
        },

        // Pagination actions
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload;
            state.currentPage = 1; // Reset to first page when changing items per page
        },
        nextPage: (state) => {
            state.currentPage += 1;
        },
        prevPage: (state) => {
            if (state.currentPage > 1) {
                state.currentPage -= 1;
            }
        },
        resetPagination: (state) => {
            state.currentPage = 1;
        },

        // Error and success actions
        setGlobalError: (state, action: PayloadAction<string | null>) => {
            state.globalError = action.payload;
        },
        clearGlobalError: (state) => {
            state.globalError = null;
        },
        setGlobalSuccess: (state, action: PayloadAction<string | null>) => {
            state.globalSuccess = action.payload;
        },
        clearGlobalSuccess: (state) => {
            state.globalSuccess = null;
        },
        clearAllMessages: (state) => {
            state.globalError = null;
            state.globalSuccess = null;
        },

        // Reset actions
        resetUI: (state) => {
            return { ...initialState, theme: state.theme }; // Keep theme preference
        },
    },
});

export const {
    // Loading actions
    setLoading,
    clearLoading,

    // Navigation actions
    toggleSidebar,
    setSidebarOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    closeAllMenus,

    // Notification actions
    addNotification,
    removeNotification,
    clearNotifications,
    clearOldNotifications,

    // Modal actions
    openModal,
    closeModal,
    removeModal,
    closeAllModals,

    // Theme actions
    setTheme,
    toggleTheme,

    // Search actions
    setSearchQuery,
    clearSearchQuery,
    toggleSearch,
    setSearchOpen,

    // Filter actions
    toggleFilters,
    setFiltersOpen,

    // Pagination actions
    setCurrentPage,
    setItemsPerPage,
    nextPage,
    prevPage,
    resetPagination,

    // Error and success actions
    setGlobalError,
    clearGlobalError,
    setGlobalSuccess,
    clearGlobalSuccess,
    clearAllMessages,

    // Reset actions
    resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
