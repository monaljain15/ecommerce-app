import React from 'react';
import { CartItem as CartItemType } from '../services/cartService';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
    isLoading?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    onRemoveItem,
    isLoading = false
}) => {
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 0) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    const handleRemove = () => {
        onRemoveItem(item.id);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">Product ID: {item.productId}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                        ${item.price.toFixed(2)}
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={isLoading || item.quantity <= 1}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={isLoading}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
