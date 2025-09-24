import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService, Order, OrderStatus } from '../services/orderService';
import toast from 'react-hot-toast';
import {
    Package,
    Search,
    Filter,
    Calendar,
    ArrowRight,
    Loader2,
    Eye,
    XCircle,
    CheckCircle,
    Clock,
    Truck,
    AlertCircle
} from 'lucide-react';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'total'>('newest');

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        filterAndSortOrders();
    }, [orders, searchTerm, statusFilter, sortBy]);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const ordersData = await orderService.getOrders();
            setOrders(ordersData);
        } catch (error: any) {
            console.error('Error loading orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSortOrders = () => {
        let filtered = [...orders];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Sort orders
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'total':
                    return b.total - a.total;
                default:
                    return 0;
            }
        });

        setFilteredOrders(filtered);
    };

    const handleCancelOrder = async (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await orderService.cancelOrder(orderId);
                await loadOrders(); // Reload orders
                toast.success('Order cancelled successfully');
            } catch (error: any) {
                console.error('Error cancelling order:', error);
                toast.error(error.message || 'Failed to cancel order');
            }
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'processing':
                return <Package className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        const colorMap = {
            pending: 'text-yellow-600 bg-yellow-100',
            processing: 'text-blue-600 bg-blue-100',
            shipped: 'text-purple-600 bg-purple-100',
            delivered: 'text-green-600 bg-green-100',
            cancelled: 'text-red-600 bg-red-100'
        };
        return colorMap[status] || 'text-gray-600 bg-gray-100';
    };

    const canCancelOrder = (status: OrderStatus) => {
        return ['pending', 'processing'].includes(status);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <p className="text-gray-600 mt-2">Track and manage your orders</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search orders or products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'total')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="total">Highest Total</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary Statistics - Moved to top */}
                {orders.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                                <div className="text-sm text-gray-600">Total Orders</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {orders.filter(o => o.status === 'delivered').length}
                                </div>
                                <div className="text-sm text-gray-600">Delivered</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                                </div>
                                <div className="text-sm text-gray-600">In Progress</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">Total Spent</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600 mb-8">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No orders match your current filters.'
                                : "You haven't placed any orders yet."
                            }
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="ml-1 capitalize">{order.status}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {orderService.formatOrderDate(order.createdAt)}
                                            </div>
                                            <div>
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </div>
                                            {order.trackingNumber && (
                                                <div className="text-blue-600">
                                                    Tracking: {order.trackingNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900">
                                            ${order.total.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {orderService.getDaysSinceOrder(order.createdAt)} days ago
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="mb-4">
                                    <div className="flex space-x-4">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 min-w-[60px]">
                                                <span className="text-sm font-medium text-gray-600">
                                                    +{order.items.length - 3} more
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </button>
                                        {canCancelOrder(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <span className="mr-1">View Full Details</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Orders;