import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { addNotification } from '../store/slices/uiSlice';

const ReduxCart: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, totalItems, totalPrice, isLoading, error } = useAppSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleAddToCart = (productId: string, quantity: number = 1) => {
        dispatch(addToCart({ productId, quantity }))
            .unwrap()
            .then(() => {
                dispatch(addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Item added to cart successfully!',
                }));
            })
            .catch((error) => {
                dispatch(addNotification({
                    type: 'error',
                    title: 'Error',
                    message: error || 'Failed to add item to cart',
                }));
            });
    };

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }

        dispatch(updateCartItem({ itemId, quantity }))
            .unwrap()
            .catch((error) => {
                dispatch(addNotification({
                    type: 'error',
                    title: 'Error',
                    message: error || 'Failed to update cart item',
                }));
            });
    };

    const handleRemoveItem = (itemId: string) => {
        dispatch(removeFromCart(itemId))
            .unwrap()
            .then(() => {
                dispatch(addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Item removed from cart',
                }));
            })
            .catch((error) => {
                dispatch(addNotification({
                    type: 'error',
                    title: 'Error',
                    message: error || 'Failed to remove item from cart',
                }));
            });
    };

    const handleClearCart = () => {
        dispatch(clearCart())
            .unwrap()
            .then(() => {
                dispatch(addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Cart cleared successfully',
                }));
            })
            .catch((error) => {
                dispatch(addNotification({
                    type: 'error',
                    title: 'Error',
                    message: error || 'Failed to clear cart',
                }));
            });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => dispatch(fetchCart())}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <div className="text-sm text-gray-600">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button
                        onClick={() => handleAddToCart('sample-product-id')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add Sample Item
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleClearCart}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                            >
                                Clear Cart
                            </button>
                            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReduxCart;
