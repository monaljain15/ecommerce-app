import React from 'react';
import { CartItem as CartItemType } from '../services/cartService';
import { ShoppingBag, CreditCard, Truck } from 'lucide-react';

interface CartSummaryProps {
    items: CartItemType[];
    onProceedToCheckout: () => void;
    onClearCart: () => void;
    isLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
    items,
    onProceedToCheckout,
    onClearCart,
    isLoading = false
}) => {
    // Calculate totals
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order Summary
            </h2>

            {/* Items Count */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                        ) : (
                            `$${shipping.toFixed(2)}`
                        )}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Shipping Info */}
            {subtotal > 50 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <div className="flex items-center text-green-800">
                        <Truck className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">You qualify for free shipping!</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={onProceedToCheckout}
                    disabled={isLoading || items.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                {items.length > 0 && (
                    <button
                        onClick={onClearCart}
                        disabled={isLoading}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    🔒 Your payment information is secure and encrypted
                </p>
            </div>
        </div>
    );
};

export default CartSummary;
