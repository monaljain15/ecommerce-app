# Redux Store Structure

This directory contains the Redux store configuration and slices for the ecommerce application. The store is built using Redux Toolkit for a more efficient and modern Redux experience.

## 📁 Directory Structure

```
store/
├── index.ts                 # Store configuration and root reducer
├── StoreProvider.tsx        # Redux Provider wrapper component
├── hooks.ts                 # Typed Redux hooks
├── slices/
│   ├── authSlice.ts         # Authentication state management
│   ├── cartSlice.ts         # Shopping cart state management
│   ├── productSlice.ts      # Product catalog state management
│   ├── orderSlice.ts        # Order management state
│   └── uiSlice.ts           # Global UI state management
└── README.md               # This file
```

## 🚀 Features

### ✅ Redux Toolkit Integration
- **Modern Redux**: Uses Redux Toolkit for simplified state management
- **TypeScript Support**: Fully typed with TypeScript for better development experience
- **DevTools**: Redux DevTools integration for debugging
- **Persistence**: State persistence using redux-persist

### ✅ State Management Slices

#### 🔐 Auth Slice (`authSlice.ts`)
- User authentication state
- Login/logout functionality
- Token management
- Password reset functionality
- User profile management

**Key Actions:**
- `loginUser` - User login
- `registerUser` - User registration
- `logoutUser` - User logout
- `forgotPassword` - Password reset request
- `resetPassword` - Password reset
- `refreshToken` - Token refresh
- `getCurrentUser` - Get current user data

#### 🛒 Cart Slice (`cartSlice.ts`)
- Shopping cart state management
- Add/remove/update cart items
- Cart totals calculation
- Local cart operations for better UX

**Key Actions:**
- `fetchCart` - Load cart from server
- `addToCart` - Add item to cart
- `updateCartItem` - Update item quantity
- `removeFromCart` - Remove item from cart
- `clearCart` - Clear entire cart

#### 📦 Product Slice (`productSlice.ts`)
- Product catalog management
- Product filtering and search
- Category and brand management
- Product details management

**Key Actions:**
- `fetchProducts` - Load products with filters
- `fetchProduct` - Load single product
- `fetchCategories` - Load product categories
- `fetchBrands` - Load product brands
- `searchProducts` - Search products

#### 📋 Order Slice (`orderSlice.ts`)
- Order management
- Order history
- Order status tracking
- Order creation and cancellation

**Key Actions:**
- `fetchOrders` - Load user orders
- `fetchOrder` - Load single order
- `createOrder` - Create new order
- `cancelOrder` - Cancel existing order

#### 🎨 UI Slice (`uiSlice.ts`)
- Global UI state management
- Loading states
- Notifications system
- Modal management
- Theme management
- Search and filter states

**Key Actions:**
- `setLoading` - Set loading state
- `addNotification` - Add notification
- `openModal` - Open modal
- `setTheme` - Set theme
- `setSearchQuery` - Set search query

## 🔧 Usage

### Basic Setup

The store is already configured in `App.tsx` with the `StoreProvider`:

```tsx
import StoreProvider from './store/StoreProvider';

function App() {
  return (
    <StoreProvider>
      {/* Your app components */}
    </StoreProvider>
  );
}
```

### Using Redux in Components

```tsx
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addToCart, fetchCart } from '../store/slices/cartSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { items, totalPrice, isLoading } = useAppSelector((state) => state.cart);

  const handleAddToCart = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

### Async Actions

All async actions are handled using `createAsyncThunk`:

```tsx
// In your component
const handleLogin = async (credentials) => {
  try {
    await dispatch(loginUser(credentials)).unwrap();
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

## 🎯 Best Practices

### 1. **Use Typed Hooks**
Always use `useAppSelector` and `useAppDispatch` instead of the raw Redux hooks:

```tsx
// ✅ Good
import { useAppSelector, useAppDispatch } from '../store/hooks';

// ❌ Avoid
import { useSelector, useDispatch } from 'react-redux';
```

### 2. **Select Specific State**
Only select the state you need to avoid unnecessary re-renders:

```tsx
// ✅ Good
const { isLoading, error } = useAppSelector((state) => state.cart);

// ❌ Avoid
const cartState = useAppSelector((state) => state.cart);
```

### 3. **Handle Loading States**
Always handle loading and error states:

```tsx
const { isLoading, error } = useAppSelector((state) => state.cart);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 4. **Use Notifications for User Feedback**
Use the UI slice for user notifications:

```tsx
import { addNotification } from '../store/slices/uiSlice';

const handleSuccess = () => {
  dispatch(addNotification({
    type: 'success',
    title: 'Success',
    message: 'Operation completed successfully!',
  }));
};
```

## 🔄 State Persistence

The store is configured to persist certain slices:

- **Auth slice**: Persisted for user session
- **Cart slice**: Persisted for cart state
- **UI slice**: Not persisted (resets on page reload)

## 🛠️ Development Tools

### Redux DevTools
The store is configured with Redux DevTools for debugging:
- Install Redux DevTools browser extension
- View state changes in real-time
- Time-travel debugging
- Action replay

### TypeScript Support
Full TypeScript support with:
- Typed selectors
- Typed actions
- Type-safe state access
- IntelliSense support

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux Persist](https://github.com/rt2zz/redux-persist)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

## 🔮 Future Enhancements

- **RTK Query**: For API state management
- **Middleware**: Custom middleware for logging, analytics
- **Selectors**: Memoized selectors for performance
- **Saga**: Redux-Saga for complex async flows
- **Normalization**: Normalized state structure for better performance
