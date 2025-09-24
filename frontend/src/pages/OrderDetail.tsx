import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, Order, OrderStatus } from '../services/orderService';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    MapPin,
    CreditCard,
    Calendar,
    Download,
    Phone,
    Loader2
} from 'lucide-react';

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadOrder(id);
        }
    }, [id]);

    const loadOrder = async (orderId: string) => {
        try {
            setIsLoading(true);
            const orderData = await orderService.getOrderById(orderId);
            setOrder(orderData);
        } catch (error: any) {
            console.error('Error loading order:', error);
            toast.error(error.message || 'Failed to load order details');
            navigate('/orders');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'processing': return <Package className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            default: return <AlertCircle className="w-5 h-5" />;
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

    const handleDownloadReceipt = () => {
        if (!order) return;

        try {
            // Generate PDF receipt
            const pdf = generatePDFReceipt(order);

            // Download the PDF
            pdf.save(`receipt-${order.orderNumber}.pdf`);

            toast.success('Receipt downloaded successfully!');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error('Failed to download receipt');
        }
    };

    const generatePDFReceipt = (order: Order): jsPDF => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;
        const lineHeight = 7;
        const margin = 20;

        // Helper function to add text with automatic line wrapping
        const addText = (text: string, x: number, y: number, options: any = {}) => {
            const maxWidth = pageWidth - x - margin;
            const lines = pdf.splitTextToSize(text, maxWidth);
            pdf.text(lines, x, y, options);
            return y + (lines.length * lineHeight);
        };

        // Helper function to draw a line
        const drawLine = (y: number) => {
            pdf.setLineWidth(0.5);
            pdf.line(margin, y, pageWidth - margin, y);
        };

        // Helper function to get status color
        const getStatusColor = (status: OrderStatus) => {
            const colorMap = {
                pending: [255, 193, 7], // Yellow
                processing: [33, 150, 243], // Blue
                shipped: [156, 39, 176], // Purple
                delivered: [76, 175, 80], // Green
                cancelled: [244, 67, 54] // Red
            };
            return colorMap[status] || [158, 158, 158]; // Gray
        };

        // Header
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('E-Commerce Store', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Order Receipt', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Draw header line
        drawLine(yPosition);
        yPosition += 10;

        // Order Information Section
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Order Information', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        // Order details
        const orderDetails = [
            `Order Number: ${order.orderNumber}`,
            `Order Date: ${orderService.formatOrderDate(order.createdAt)}`,
            `Status: ${order.status.toUpperCase()}`,
            ...(order.trackingNumber ? [`Tracking: ${order.trackingNumber}`] : [])
        ];

        orderDetails.forEach(detail => {
            yPosition = addText(detail, margin, yPosition);
        });

        yPosition += 5;

        // Customer Information
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Customer Information', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        const customerDetails = [
            `Name: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            `Email: customer@example.com`,
            `Phone: ${order.shippingAddress.phone || 'N/A'}`
        ];

        customerDetails.forEach(detail => {
            yPosition = addText(detail, margin, yPosition);
        });

        yPosition += 10;

        // Order Items Table
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Order Items', margin, yPosition);
        yPosition += 8;

        // Table headers
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        const tableHeaders = ['Item', 'Price', 'Qty', 'Total'];
        const colWidths = [80, 25, 20, 25];
        let xPosition = margin;

        tableHeaders.forEach((header, index) => {
            pdf.text(header, xPosition, yPosition);
            xPosition += colWidths[index];
        });

        yPosition += 5;
        drawLine(yPosition);
        yPosition += 5;

        // Table rows
        pdf.setFont('helvetica', 'normal');
        order.items.forEach(item => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = 20;
            }

            // Item name and SKU
            const itemText = `${item.name}\nSKU: ${item.productId}`;
            const textLines = pdf.splitTextToSize(itemText, pageWidth - margin - 150);
            const itemHeight = textLines.length * lineHeight;

            pdf.text(itemText, margin, yPosition);

            // Price, quantity, and total
            pdf.text(`$${item.price.toFixed(2)}`, margin + 80, yPosition);
            pdf.text(item.quantity.toString(), margin + 105, yPosition);
            pdf.text(`$${(item.price * item.quantity).toFixed(2)}`, margin + 125, yPosition);

            yPosition += Math.max(itemHeight, lineHeight) + 2;
        });

        yPosition += 10;

        // Totals Section
        drawLine(yPosition);
        yPosition += 8;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');

        const totals = [
            { label: 'Subtotal:', value: `$${order.subtotal.toFixed(2)}` },
            { label: 'Shipping:', value: order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}` },
            { label: 'Tax:', value: `$${order.tax.toFixed(2)}` }
        ];

        totals.forEach(total => {
            pdf.text(total.label, margin + 100, yPosition);
            pdf.text(total.value, margin + 130, yPosition);
            yPosition += 6;
        });

        // Final total
        drawLine(yPosition);
        yPosition += 8;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Total:', margin + 100, yPosition);
        pdf.text(`$${order.total.toFixed(2)}`, margin + 130, yPosition);
        yPosition += 15;

        // Shipping Address
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Shipping Address', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        const addressLines = [
            `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            order.shippingAddress.address1,
            ...(order.shippingAddress.address2 ? [order.shippingAddress.address2] : []),
            `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
            order.shippingAddress.country
        ];

        addressLines.forEach(line => {
            yPosition = addText(line, margin, yPosition);
        });

        yPosition += 10;

        // Payment Method
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Payment Method', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const paymentText = `${order.paymentMethod.brand.toUpperCase()} •••• ${order.paymentMethod.last4}\nExpires ${order.paymentMethod.expMonth}/${order.paymentMethod.expYear}`;
        yPosition = addText(paymentText, margin, yPosition);

        yPosition += 15;

        // Footer
        drawLine(yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 6;

        const receiptDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        pdf.text(`Generated on ${receiptDate}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 6;
        pdf.text('For support, contact us at support@ecommerce.com', pageWidth / 2, yPosition, { align: 'center' });

        return pdf;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                            <p className="text-gray-600 mt-1">
                                Placed on {orderService.formatOrderDate(order.createdAt)}
                            </p>
                        </div>
                        <button
                            onClick={handleDownloadReceipt}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Receipt
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-2 capitalize">{order.status}</span>
                                </span>
                            </div>
                            {order.trackingNumber && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                                    <p className="text-lg font-mono text-blue-700">{order.trackingNumber}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Product ID: {item.productId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                Total: ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                        </p>
                                        <p className="text-gray-600">{order.shippingAddress.address1}</p>
                                        <p className="text-gray-600">
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </p>
                                        <p className="text-gray-600">{order.shippingAddress.country}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Address</h2>
                                <div className="flex items-start space-x-3">
                                    <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.billingAddress.firstName} {order.billingAddress.lastName}
                                        </p>
                                        <p className="text-gray-600">{order.billingAddress.address1}</p>
                                        <p className="text-gray-600">
                                            {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                                        </p>
                                        <p className="text-gray-600">{order.billingAddress.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                            <div className="flex items-center space-x-3">
                                <CreditCard className="w-8 h-8 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {order.paymentMethod.brand.toUpperCase()} •••• {order.paymentMethod.last4}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Expires {order.paymentMethod.expMonth}/{order.paymentMethod.expYear}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;