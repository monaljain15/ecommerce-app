import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { RootState, AppDispatch } from '../store';
import { addToFavorites, removeFromFavoritesByProductId, toggleFavoriteOptimistic } from '../store/slices/favoritesSlice';
import { Star, ShoppingCart, Heart, Plus, Minus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    className?: string;
    showCartControls?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    className = '',
    showCartControls = false
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { getCartQuantity, addToCart, updateQuantity, items } = useCart();
    const { favorites, isAdding, isRemoving } = useSelector((state: RootState) => state.favorites);

    const cartQuantity = getCartQuantity(product.id);
    const cartItem = items.find(item => item.productId === product.id);
    const isInWishlist = favorites.some(fav => fav.productId === product.id);

    const handleAddToCart = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (onAddToCart) {
            onAddToCart(product);
        } else {
            try {
                await addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || ''
                });
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    };

    const handleIncreaseQuantity = async () => {
        if (cartItem) {
            try {
                await updateQuantity(cartItem.id, cartQuantity + 1);
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        } else {
            await handleAddToCart();
        }
    };

    const handleDecreaseQuantity = async () => {
        if (cartItem && cartQuantity > 1) {
            try {
                await updateQuantity(cartItem.id, cartQuantity - 1);
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        } else if (cartItem && cartQuantity === 1) {
            try {
                await updateQuantity(cartItem.id, 0);
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error('Please log in to add favorites');
            return;
        }

        try {
            // Optimistic update for immediate UI feedback
            dispatch(toggleFavoriteOptimistic({
                productId: product.id,
                isFavorited: !isInWishlist
            }));

            if (isInWishlist) {
                await dispatch(removeFromFavoritesByProductId(product.id)).unwrap();
            } else {
                await dispatch(addToFavorites({ productId: product.id })).unwrap();
            }
        } catch (error: any) {
            console.error('Error toggling wishlist:', error);
            // Revert optimistic update on error
            dispatch(toggleFavoriteOptimistic({
                productId: product.id,
                isFavorited: isInWishlist
            }));
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                    }`}
            />
        ));
    };



    return (
        <div className={`group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
            <Link to={`/products/${product.id}`} className="block">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleToggleWishlist}
                        disabled={isAdding || isRemoving}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                        {isAdding || isRemoving ? (
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        ) : (
                            <Heart
                                className={`w-5 h-5 ${isInWishlist
                                    ? 'text-red-500 fill-current'
                                    : 'text-gray-400 hover:text-red-500'
                                    }`}
                            />
                        )}
                    </button>

                    {/* Stock Badge */}
                    {product.stock < 10 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Only {product.stock} left
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Brand */}
                    <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                            {renderStars(product.rating)}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">
                            ({product.reviewCount})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.stock > 0 ? (
                            <span className="text-sm text-green-600 font-medium">
                                In Stock
                            </span>
                        ) : (
                            <span className="text-sm text-red-600 font-medium">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Cart Controls */}
                    {product.stock > 0 && (
                        <>
                            {showCartControls && cartQuantity > 0 ? (
                                /* Quantity Controls */
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={handleDecreaseQuantity}
                                        className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium min-w-[2rem] text-center">
                                        {cartQuantity}
                                    </span>
                                    <button
                                        onClick={handleIncreaseQuantity}
                                        className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                /* Add to Cart Button */
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 group/btn"
                                >
                                    <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                                    {cartQuantity > 0 ? `Add More (${cartQuantity})` : 'Add to Cart'}
                                </button>
                            )}
                        </>
                    )}

                    {product.stock === 0 && (
                        <button
                            disabled
                            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                        >
                            Out of Stock
                        </button>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
