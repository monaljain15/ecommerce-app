import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import NotificationSystem from './NotificationSystem';
import LoadingOverlay from './LoadingOverlay';
import FavoritesLoader from './FavoritesLoader';
import { ShoppingCart, Heart } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();

    return (
        <div className="min-h-screen bg-gray-50">
            <FavoritesLoader />
            <nav className="bg-white shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold text-gray-800">
                                Ecommerce
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/products"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Products
                            </Link>

                            <div className="flex items-center space-x-4">
                                {/* Cart Icon - Available for all users */}
                                <Link
                                    to="/cart"
                                    className="relative text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {totalItems > 99 ? '99+' : totalItems}
                                        </span>
                                    )}
                                </Link>

                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Orders
                                        </Link>
                                        <Link
                                            to="/favorites"
                                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                        >
                                            <Heart className="w-4 h-4 mr-1" />
                                            Favorites
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            {/* Redux Components */}
            <NotificationSystem />
            <LoadingOverlay />

            <footer className="bg-gray-800 text-white py-8 mt-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                                <li><Link to="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><Link to="/help" className="text-gray-300 hover:text-white">Help Center</Link></li>
                                <li><Link to="/shipping" className="text-gray-300 hover:text-white">Shipping Info</Link></li>
                                <li><Link to="/returns" className="text-gray-300 hover:text-white">Returns</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
                                <li><Link to="/cookies" className="text-gray-300 hover:text-white">Cookie Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Connect</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white">Facebook</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-300">&copy; 2024 Ecommerce App. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
