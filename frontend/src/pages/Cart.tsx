import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { totalItems, items, updateQuantity, removeFromCart, clearCart, loading } = useCart();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        try {
            setIsUpdating(itemId);
            await updateQuantity(itemId, quantity);
            toast.success('Cart updated');
        } catch (error: any) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update item quantity');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            setIsUpdating(itemId);
            await removeFromCart(itemId);
            toast.success('Item removed from cart');
        } catch (error: any) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item from cart');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await clearCart();
                toast.success('Cart cleared');
            } catch (error: any) {
                console.error('Error clearing cart:', error);
                toast.error('Failed to clear cart');
            }
        }
    };

    const handleProceedToCheckout = () => {
        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                                <p className="text-gray-600 mt-1">
                                    {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <ShoppingCart className="w-6 h-6 mr-2" />
                            <span className="text-lg font-semibold">{totalItems}</span>
                        </div>
                    </div>
                </div>

                {items.length === 0 ? (
                    /* Empty Cart */
                    <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    /* Cart with Items */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Items</h2>
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem}
                                    isLoading={isUpdating === item.id}
                                />
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <CartSummary
                                items={items}
                                onProceedToCheckout={handleProceedToCheckout}
                                onClearCart={handleClearCart}
                                isLoading={loading}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;