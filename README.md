# 🛒 Ecommerce Web Application

A full-stack ecommerce application built with React.js frontend and Node.js + Express + TypeScript backend, featuring PostgreSQL database integration, Stripe payments, Redux state management, and comprehensive user management.

## 🏗️ Architecture

- **Frontend**: React.js with TypeScript + Redux Toolkit
- **Backend**: Node.js + Express + TypeScript (Modular Architecture)
- **Database**: PostgreSQL with Sequelize ORM
- **State Management**: Redux Toolkit + React Context (Hybrid)
- **Authentication**: JWT tokens
- **Payments**: Stripe integration
- **File Storage**: AWS S3
- **Email**: AWS SES

## 🚀 Features

### Frontend (React.js + Redux)

#### 🔐 Authentication
- User registration and login
- Forgot/Reset password functionality
- JWT token management (localStorage/HttpOnly cookies)
- Protected routes and middleware
- Redux-based authentication state management

#### 👤 User Profile
- View and edit profile details
- Change password functionality
- Optional profile picture upload
- User preferences management
- Redux state management for user data

#### 🛍️ Product Catalog
- Homepage with featured products
- Product listing with search, sort, and filter capabilities
- Detailed product pages with images, descriptions, reviews, and ratings
- Category-based navigation
- Redux state management for product data

#### 🛒 Shopping Cart
- Add, remove, and update cart items
- Real-time cart summary with totals
- Persistent cart across sessions (Redux Persist)
- Checkout flow integration
- Redux-based cart state management

#### 💳 Checkout & Payments
- Comprehensive shipping information form
- Stripe payment gateway integration
- Order confirmation and tracking
- Payment success/failure handling
- Redux state management for orders

#### 📦 Orders Management
- Complete order history view
- Detailed order information (products, totals, status)
- Order tracking and status updates
- Order cancellation (if applicable)
- Redux state management for order data

#### ⭐ Reviews & Ratings
- Add reviews and ratings for purchased products
- Display average ratings and user reviews
- Review moderation and management
- Redux state management for reviews

#### 🎨 UI/UX Features
- Global notification system (Redux + React Hot Toast)
- Loading states management
- Modal management system
- Theme management (light/dark/system)
- Responsive design with Tailwind CSS

### Backend (Node.js + Express + TypeScript - Modular Architecture)

#### 🏗️ Modular Structure
- **Feature-based modules**: Each feature has its own module with controller, service, routes, validator, and middleware
- **Clean separation of concerns**: Business logic, data access, and presentation layers
- **Scalable architecture**: Easy to add new features and maintain existing ones
- **Consistent patterns**: All modules follow the same structure and conventions

#### 🔐 Authentication Module
- User registration with validation
- Secure login with JWT authentication
- Password reset via email (AWS SES)
- Token refresh and validation
- Additional middleware for enhanced security

#### 👤 User Management Module
- User profile CRUD operations
- Password change functionality
- Role-based access control
- Admin user management
- User-specific middleware for validation

#### 📦 Product Management Module
- Complete CRUD operations for products
- Product image upload to AWS S3
- Advanced search and filtering
- Category and inventory management
- Product-specific middleware for validation

#### 🛒 Shopping Cart Module
- User-specific cart management
- Cart synchronization across devices
- Session-based cart for guests
- Cart persistence and recovery
- Cart-specific middleware for validation

#### 📋 Order Processing Module
- Order creation and management
- Product-user-payment linking
- Order status tracking
- Order history and reporting
- Order-specific middleware for validation

#### ⭐ Review System Module
- Product review and rating management
- Average rating calculations
- Review moderation tools
- User review history
- Review-specific middleware for validation

#### 💰 Payment Integration Module
- Stripe API integration
- Payment confirmation handling
- Transaction logging and tracking
- Refund processing
- Payment-specific middleware for validation

#### 📧 Notification System
- Order confirmation emails (AWS SES)
- Password reset notifications
- Order status updates
- Event publishing (AWS SNS)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Redux** - Redux bindings
- **Redux Persist** - State persistence
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Server state management and caching
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Stripe Elements** - Payment UI
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Sequelize** - PostgreSQL ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Stripe** - Payment processing
- **AWS SDK** - S3 and SES integration

### Database
- **PostgreSQL** - Primary database
- **Redis** - Session storage and caching

### DevOps & Deployment
- **Docker** - Containerization
- **AWS S3** - File storage
- **AWS SES** - Email service
- **AWS SNS** - Notification service
- **PM2** - Process management

## 📁 Project Structure

```
ecommerce-app/
├── frontend/                 # React.js frontend with Redux
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── NotificationSystem.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   └── ReduxCart.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── contexts/       # React Context (Hybrid approach)
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── store/          # Redux store
│   │   │   ├── index.ts
│   │   │   ├── StoreProvider.tsx
│   │   │   ├── hooks.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── cartSlice.ts
│   │   │       ├── productSlice.ts
│   │   │       ├── orderSlice.ts
│   │   │       └── uiSlice.ts
│   │   ├── services/       # API services
│   │   │   ├── authService.ts
│   │   │   └── cartService.ts
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── styles/         # CSS and styling
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                 # Node.js backend (Modular Architecture)
│   ├── src/
│   │   ├── modules/        # Feature-based modules
│   │   │   ├── auth/
│   │   │   │   ├── authController.ts
│   │   │   │   ├── authMiddleware.ts
│   │   │   │   ├── authAdditionalMiddleware.ts
│   │   │   │   ├── authRoutes.ts
│   │   │   │   ├── authService.ts
│   │   │   │   └── authValidator.ts
│   │   │   ├── user/
│   │   │   │   ├── userController.ts
│   │   │   │   ├── userMiddleware.ts
│   │   │   │   ├── userRoutes.ts
│   │   │   │   ├── userService.ts
│   │   │   │   └── userValidator.ts
│   │   │   ├── cart/
│   │   │   │   ├── cartController.ts
│   │   │   │   ├── cartMiddleware.ts
│   │   │   │   ├── cartRoutes.ts
│   │   │   │   ├── cartService.ts
│   │   │   │   └── cartValidator.ts
│   │   │   ├── product/
│   │   │   │   ├── productController.ts
│   │   │   │   ├── productMiddleware.ts
│   │   │   │   ├── productRoutes.ts
│   │   │   │   ├── productService.ts
│   │   │   │   └── productValidator.ts
│   │   │   ├── order/
│   │   │   │   ├── orderController.ts
│   │   │   │   ├── orderMiddleware.ts
│   │   │   │   ├── orderRoutes.ts
│   │   │   │   ├── orderService.ts
│   │   │   │   └── orderValidator.ts
│   │   │   ├── payment/
│   │   │   │   ├── paymentController.ts
│   │   │   │   ├── paymentMiddleware.ts
│   │   │   │   ├── paymentRoutes.ts
│   │   │   │   ├── paymentService.ts
│   │   │   │   └── paymentValidator.ts
│   │   │   └── review/
│   │   │       ├── reviewController.ts
│   │   │       ├── reviewMiddleware.ts
│   │   │       ├── reviewRoutes.ts
│   │   │       ├── reviewService.ts
│   │   │       └── reviewValidator.ts
│   │   ├── routes/         # Consolidated API routes
│   │   │   └── index.ts
│   │   ├── middleware/     # Global middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── notFound.ts
│   │   ├── config/         # Configuration files
│   │   │   ├── database.js
│   │   │   └── database.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml      # Development environment
├── .env.example           # Environment variables template
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)
- AWS Account (for S3, SES, SNS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp .env.example .env
   
   # Update environment variables
   # - Database credentials
   # - JWT secrets
   # - AWS credentials
   # - Stripe keys
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis
   # Create database
   createdb ecommerce_app
   
   # Run migrations
   cd backend
   npm run migrate
   ```

5. **Start Development Servers**
   ```bash
   # Start backend (Terminal 1)
   cd backend
   npm run dev
   
   # Start frontend (Terminal 2)
   cd frontend
   npm start
   ```

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🔄 State Management Architecture

### Redux + Context Hybrid Approach

The application uses a **hybrid state management approach** combining Redux Toolkit and React Context:

#### **Redux Toolkit** (Complex State)
- **Authentication**: User login, registration, token management
- **Shopping Cart**: Cart items, totals, persistence
- **Products**: Product catalog, search, filters
- **Orders**: Order history, status tracking
- **UI State**: Notifications, loading states, modals, theme

#### **React Context** (Simple State)
- **Legacy Support**: Maintains existing context functionality
- **Specific Use Cases**: Simple state that doesn't need Redux complexity
- **Gradual Migration**: Easy migration path from context to Redux

### Redux Store Structure

```typescript
// Store slices
{
  auth: AuthState,      // User authentication
  cart: CartState,      // Shopping cart
  product: ProductState, // Product catalog
  order: OrderState,    // Order management
  ui: UIState          // Global UI state
}
```

### Key Redux Features

- **Redux Persist**: Cart and auth state persistence
- **TypeScript Support**: Fully typed with custom hooks
- **DevTools Integration**: Redux DevTools for debugging
- **Async Thunks**: Server state management
- **Middleware**: Custom middleware for each feature

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh access token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `POST /api/users/upload-avatar` - Upload avatar
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id/status` - Update user status (Admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund (Admin)
- `POST /api/payments/webhook` - Handle payment webhook
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get payment details

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `GET /api/reviews/stats/:productId` - Get review statistics
- `GET /api/reviews/user/:userId` - Get user reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🏗️ Backend Modular Architecture

### Feature-Based Module Structure

Each feature is organized as a self-contained module with:

```
modules/feature-name/
├── featureController.ts    # Request handling
├── featureService.ts       # Business logic
├── featureRoutes.ts        # Route definitions
├── featureValidator.ts     # Input validation
└── featureMiddleware.ts    # Feature-specific middleware
```

### Key Benefits

- **Separation of Concerns**: Clear boundaries between features
- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Each module is self-contained and testable
- **Consistency**: All modules follow the same structure and patterns
- **Reusability**: Middleware and utilities can be shared across modules

### Module Features

#### **Authentication Module**
- JWT token management
- Password hashing and validation
- Email verification and password reset
- Session management
- Role-based access control

#### **User Management Module**
- Profile management
- User preferences
- Avatar upload handling
- Admin user management
- User activity tracking

#### **Product Management Module**
- CRUD operations for products
- Image upload and management
- Category and brand management
- Search and filtering
- Inventory management

#### **Cart Management Module**
- Add/remove/update cart items
- Cart persistence
- Stock validation
- Cart synchronization
- Guest cart support

#### **Order Management Module**
- Order creation and processing
- Status tracking
- Order history
- Cancellation handling
- Admin order management

#### **Payment Module**
- Stripe integration
- Payment processing
- Refund handling
- Webhook management
- Transaction logging

#### **Review Module**
- Product reviews and ratings
- Review moderation
- Rating calculations
- User review history
- Content validation

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Session management and timeout
- Account lockout protection

### Input Validation & Sanitization
- Comprehensive input validation using express-validator
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- File upload validation and type checking
- Rate limiting on sensitive endpoints

### API Security
- CORS configuration for cross-origin requests
- Helmet.js for security headers
- Request size limiting
- API rate limiting per IP/user
- Secure cookie configuration

### Data Protection
- Environment variable protection
- Database connection encryption
- Sensitive data encryption at rest
- Audit logging for security events
- Error handling without information leakage

## 🚀 Deployment

### Production Build
```bash
# Build both frontend and backend
cd frontend && npm run build
cd ../backend && npm run build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🛠️ Development Workflow

### Frontend Development

#### Using Redux
```tsx
// Import Redux hooks
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.cart);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      Add to Cart
    </button>
  );
}
```

#### Using Context (Legacy)
```tsx
// Import context hooks
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  const { items, addItem } = useCart();
  
  // Component logic
}
```

### Backend Development

#### Adding a New Module
1. Create module directory: `src/modules/newFeature/`
2. Add required files:
   - `newFeatureController.ts`
   - `newFeatureService.ts`
   - `newFeatureRoutes.ts`
   - `newFeatureValidator.ts`
   - `newFeatureMiddleware.ts`
3. Update `src/routes/index.ts` to include new routes
4. Add types to `src/types/index.ts`

#### Module Structure Example
```typescript
// newFeatureController.ts
export const newFeatureController = {
  async getItems(req: Request, res: Response, next: NextFunction) {
    // Controller logic
  },
  // ... other methods
};

// newFeatureService.ts
export const newFeatureService = {
  async getItems() {
    // Business logic
  },
  // ... other methods
};
```

### State Management Guidelines

#### When to Use Redux
- Complex state that needs to be shared across components
- State that needs persistence (cart, auth)
- State with complex logic or async operations
- State that benefits from time-travel debugging

#### When to Use Context
- Simple state that's only used in a small component tree
- Theme or configuration state
- Legacy code that works well with context
- State that doesn't need persistence

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install` (both frontend and backend)
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Create a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add proper error handling
- Include JSDoc comments for complex functions
- Write tests for new features
- Follow the existing code style and patterns

### Pull Request Guidelines
- Provide a clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Request review from maintainers

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository.
