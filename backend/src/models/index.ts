import sequelize from '../config/database';

// Import all models
import User from './User';
import Category from './Category';
import Brand from './Brand';
import Product from './Product';
import Address from './Address';
import CartItem from './CartItem';
import Order from './Order';
import OrderItem from './OrderItem';
import Review from './Review';
import Favorite from './Favorite';
import Payment from './Payment';
import PaymentMethod from './PaymentMethod';
import RefreshToken from './RefreshToken';

// Define associations
const setupAssociations = () => {
    // User associations
    User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
    User.hasMany(CartItem, { foreignKey: 'userId', as: 'cartItems' });
    User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
    User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
    User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
    User.hasMany(PaymentMethod, { foreignKey: 'userId', as: 'paymentMethods' });
    User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });

    // Category associations
    Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
    Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
    Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

    // Brand associations
    Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });

    // Product associations
    Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });
    Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
    Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
    Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
    Product.hasMany(Favorite, { foreignKey: 'productId', as: 'favorites' });

    // Address associations
    Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Address.hasMany(Order, { foreignKey: 'shippingAddressId', as: 'shippingOrders' });
    Address.hasMany(Order, { foreignKey: 'billingAddressId', as: 'billingOrders' });

    // CartItem associations
    CartItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

    // Order associations
    Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Order.belongsTo(Address, { foreignKey: 'shippingAddressId', as: 'shippingAddress' });
    Order.belongsTo(Address, { foreignKey: 'billingAddressId', as: 'billingAddress' });
    Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
    Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });

    // OrderItem associations
    OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
    OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

    // Review associations
    Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    Review.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

    // Favorite associations
    Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Favorite.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

    // Payment associations
    Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

    // PaymentMethod associations
    PaymentMethod.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // RefreshToken associations
    RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};

// Setup associations
setupAssociations();

// Export all models
export {
    User,
    Category,
    Brand,
    Product,
    Address,
    CartItem,
    Order,
    OrderItem,
    Review,
    Favorite,
    Payment,
    PaymentMethod,
    RefreshToken,
};

// Export sequelize instance
export { sequelize };

// Export default object with all models
export default {
    User,
    Category,
    Brand,
    Product,
    Address,
    CartItem,
    Order,
    OrderItem,
    Review,
    Favorite,
    Payment,
    PaymentMethod,
    RefreshToken,
    sequelize,
};
