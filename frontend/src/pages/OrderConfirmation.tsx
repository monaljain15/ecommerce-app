import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, CreditCard, ArrowLeft, Download } from 'lucide-react';

interface OrderData {
    orderId: string;
    orderSummary: {
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        items: Array<{
            id: string;
            name: string;
            price: number;
            quantity: number;
            image: string;
        }>;
    };
    shippingAddress: any;
    billingAddress: any;
    paymentMethod: any;
}

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state as OrderData;

    const [orderDetails, setOrderDetails] = useState({
        orderId: orderData?.orderId || 'ORDER-12345',
        orderDate: new Date().toLocaleDateString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        total: orderData?.orderSummary?.total || 0,
        items: orderData?.orderSummary?.items || []
    });

    useEffect(() => {
        if (orderData) {
            setOrderDetails({
                orderId: orderData.orderId,
                orderDate: new Date().toLocaleDateString(),
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                total: orderData.orderSummary.total,
                items: orderData.orderSummary.items
            });
        } else {
            // Redirect to cart if no order data is available
            navigate('/cart');
        }
    }, [orderData, navigate]);

    const handleContinueShopping = () => {
        navigate('/products');
    };

    const handleViewOrder = () => {
        if (orderData?.orderId) {
            navigate(`/orders/${orderData.orderId}`);
        } else {
            navigate('/orders');
        }
    };

    const handleDownloadReceipt = () => {
        // In a real app, this would download the actual receipt
        alert('Receipt download functionality would be implemented here');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-gray-600">
                        Thank you for your purchase. Your order has been successfully placed.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleDownloadReceipt}
                                className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Receipt
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">Order Number</h3>
                            <p className="text-lg font-semibold text-gray-600">{orderDetails.orderId}</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
                                <Truck className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">Estimated Delivery</h3>
                            <p className="text-lg font-semibold text-gray-600">{orderDetails.estimatedDelivery}</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-3">
                                <CreditCard className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">Total Amount</h3>
                            <p className="text-lg font-semibold text-gray-600">${orderDetails.total.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {orderDetails.items.map((item: any) => (
                                <div key={item.id} className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-medium text-blue-900 mb-3">What's Next?</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                        <p>• You will receive an email confirmation shortly</p>
                        <p>• We'll send you tracking information once your order ships</p>
                        <p>• You can track your order status in your account</p>
                        <p>• If you have any questions, please contact our support team</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleContinueShopping}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={handleViewOrder}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                    >
                        View Order Details
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center justify-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
