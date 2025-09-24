import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Eye, Star, Loader2 } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchFavorites, removeFromFavorites } from '../store/slices/favoritesSlice';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const Favorites: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { favorites, isLoading, isRemoving } = useSelector((state: RootState) => state.favorites);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchFavorites(user.id));
        }
    }, [dispatch, user]);

    const handleRemoveFavorite = async (favoriteId: string, productId: string) => {
        try {
            setRemovingId(favoriteId);
            await dispatch(removeFromFavorites(favoriteId)).unwrap();
        } catch (error: any) {
            console.error('Error removing favorite:', error);
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = async (product: any) => {
        try {
            await addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] || ''
            });
            toast.success('Item added to cart!');
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your favorites</h1>
                    <p className="text-gray-600 mb-6">You need to be authenticated to access this page.</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">Loading your favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Heart className="w-8 h-8 mr-3 text-red-500" />
                        My Favorites
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your favorites
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start adding products to your favorites by clicking the heart icon on any product.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((favorite) => (
                            <div
                                key={favorite.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={favorite.product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?w=400&h=400&fit=crop'}
                                        alt={favorite.product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                            <Link
                                                to={`/products/${favorite.product.id}`}
                                                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-700" />
                                            </Link>
                                            <button
                                                onClick={() => handleAddToCart(favorite.product)}
                                                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart className="w-4 h-4 text-gray-700" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove from Favorites Button */}
                                    <button
                                        onClick={() => handleRemoveFavorite(favorite.id, favorite.product.id)}
                                        disabled={removingId === favorite.id}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                        title="Remove from Favorites"
                                    >
                                        {removingId === favorite.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                                            {favorite.product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{favorite.product.brand}</p>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center mb-3">
                                        <StarRating rating={favorite.product.rating} size="sm" />
                                        <span className="text-sm text-gray-600 ml-2">
                                            ({favorite.product.reviewCount})
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(favorite.product.price)}
                                        </span>
                                        <span className={`text-sm px-2 py-1 rounded-full ${favorite.product.stock > 10
                                            ? 'bg-green-100 text-green-800'
                                            : favorite.product.stock > 0
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {favorite.product.stock > 0 ? `${favorite.product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/products/${favorite.product.id}`}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleAddToCart(favorite.product)}
                                            disabled={favorite.product.stock === 0}
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
