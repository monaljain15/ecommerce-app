import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { paymentService, Address, PaymentMethod, OrderSummary } from '../services/paymentService';
import { orderService, CreateOrderData } from '../services/orderService';
import AddressForm from '../components/AddressForm';
import PaymentMethodForm from '../components/PaymentMethodForm';
import toast from 'react-hot-toast';
import {
    ShoppingCart,
    MapPin,
    CreditCard,
    CheckCircle,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    Loader2,
    Lock
} from 'lucide-react';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalItems, totalPrice, clearCart } = useCart();

    // State for addresses
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedShippingAddress, setSelectedShippingAddress] = useState<Address | null>(null);
    const [selectedBillingAddress, setSelectedBillingAddress] = useState<Address | null>(null);
    const [showAddressForm, setShowAddressForm] = useState<{ type: 'shipping' | 'billing'; address?: Address } | null>(null);

    // State for payment methods
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [showPaymentForm, setShowPaymentForm] = useState<{ method?: PaymentMethod } | null>(null);

    // State for checkout process
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'review' | 'processing'>('address');

    // Loading states
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
            return;
        }

        loadAddresses();
        loadPaymentMethods();
    }, [items, navigate]);

    const loadAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const addressList = await paymentService.getAddresses();
            setAddresses(addressList);

            // Set default addresses
            const defaultShipping = addressList.find(addr => addr.type === 'shipping' && addr.isDefault);
            const defaultBilling = addressList.find(addr => addr.type === 'billing' && addr.isDefault);

            setSelectedShippingAddress(defaultShipping || null);
            setSelectedBillingAddress(defaultBilling || null);
        } catch (error: any) {
            console.error('Error loading addresses:', error);
            toast.error('Failed to load addresses');
        } finally {
            setLoadingAddresses(false);
        }
    };

    const loadPaymentMethods = async () => {
        try {
            setLoadingPaymentMethods(true);
            const methods = await paymentService.getPaymentMethods();
            setPaymentMethods(methods);

            // Set default payment method
            const defaultMethod = methods.find(method => method.isDefault);
            setSelectedPaymentMethod(defaultMethod || null);
        } catch (error: any) {
            console.error('Error loading payment methods:', error);
            toast.error('Failed to load payment methods');
        } finally {
            setLoadingPaymentMethods(false);
        }
    };

    const handleSaveAddress = async (addressData: Omit<Address, 'id'>) => {
        try {
            if (showAddressForm?.address) {
                // Update existing address
                const updatedAddress = await paymentService.updateAddress(showAddressForm.address.id!, addressData);
                setAddresses(prev => prev.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));

                // Update selected address if it was the one being edited
                if (showAddressForm.type === 'shipping' && selectedShippingAddress?.id === updatedAddress.id) {
                    setSelectedShippingAddress(updatedAddress);
                } else if (showAddressForm.type === 'billing' && selectedBillingAddress?.id === updatedAddress.id) {
                    setSelectedBillingAddress(updatedAddress);
                }

                toast.success('Address updated successfully');
            } else {
                // Create new address
                const newAddress = await paymentService.saveAddress(addressData);
                setAddresses(prev => [...prev, newAddress]);

                // Auto-select if it's the first address of its type
                if (showAddressForm?.type === 'shipping' && !selectedShippingAddress) {
                    setSelectedShippingAddress(newAddress);
                } else if (showAddressForm?.type === 'billing' && !selectedBillingAddress) {
                    setSelectedBillingAddress(newAddress);
                }

                toast.success('Address saved successfully');
            }

            setShowAddressForm(null);
        } catch (error: any) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        }
    };

    const handleSavePaymentMethod = async (paymentData: {
        type: 'card';
        cardNumber: string;
        expMonth: number;
        expYear: number;
        cvc: string;
        name: string;
    }) => {
        try {
            if (showPaymentForm?.method) {
                // Update existing payment method (not implemented in mock)
                toast.error('Payment method updates not implemented in demo');
                return;
            } else {
                // Create new payment method
                const newMethod = await paymentService.savePaymentMethod(paymentData);
                setPaymentMethods(prev => [...prev, newMethod]);

                // Auto-select if it's the first payment method
                if (!selectedPaymentMethod) {
                    setSelectedPaymentMethod(newMethod);
                }

                toast.success('Payment method saved successfully');
            }

            setShowPaymentForm(null);
        } catch (error: any) {
            console.error('Error saving payment method:', error);
            toast.error('Failed to save payment method');
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await paymentService.deleteAddress(addressId);
                setAddresses(prev => prev.filter(addr => addr.id !== addressId));

                // Clear selection if deleted address was selected
                if (selectedShippingAddress?.id === addressId) {
                    setSelectedShippingAddress(null);
                }
                if (selectedBillingAddress?.id === addressId) {
                    setSelectedBillingAddress(null);
                }

                toast.success('Address deleted successfully');
            } catch (error: any) {
                console.error('Error deleting address:', error);
                toast.error('Failed to delete address');
            }
        }
    };

    const handleDeletePaymentMethod = async (methodId: string) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            try {
                await paymentService.deletePaymentMethod(methodId);
                setPaymentMethods(prev => prev.filter(method => method.id !== methodId));

                // Clear selection if deleted method was selected
                if (selectedPaymentMethod?.id === methodId) {
                    setSelectedPaymentMethod(null);
                }

                toast.success('Payment method deleted successfully');
            } catch (error: any) {
                console.error('Error deleting payment method:', error);
                toast.error('Failed to delete payment method');
            }
        }
    };

    const handleProceedToPayment = () => {
        if (!selectedShippingAddress) {
            toast.error('Please select a shipping address');
            return;
        }
        if (!selectedBillingAddress) {
            toast.error('Please select a billing address');
            return;
        }
        setCurrentStep('payment');
    };

    const handleProceedToReview = () => {
        if (!selectedPaymentMethod) {
            toast.error('Please select a payment method');
            return;
        }
        setCurrentStep('review');
    };

    const handlePlaceOrder = async () => {
        if (!selectedShippingAddress || !selectedBillingAddress || !selectedPaymentMethod) {
            toast.error('Please complete all required information');
            return;
        }

        try {
            setIsProcessing(true);
            setCurrentStep('processing');

            // Create order summary
            const subtotal = totalPrice;
            const shipping = subtotal > 50 ? 0 : 9.99;
            const tax = subtotal * 0.08;
            const total = subtotal + shipping + tax;

            const orderSummary: OrderSummary = {
                subtotal,
                shipping,
                tax,
                total,
                items: items.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                }))
            };

            // Create payment intent
            const paymentIntent = await paymentService.createPaymentIntent(orderSummary);

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Confirm payment
            const result = await paymentService.confirmPayment(paymentIntent.id, selectedPaymentMethod.id);

            if (result.success) {
                // Create order in the order service
                const orderData: CreateOrderData = {
                    items: orderSummary.items,
                    subtotal: orderSummary.subtotal,
                    shipping: orderSummary.shipping,
                    tax: orderSummary.tax,
                    total: orderSummary.total,
                    shippingAddress: {
                        firstName: selectedShippingAddress.firstName,
                        lastName: selectedShippingAddress.lastName,
                        company: selectedShippingAddress.company,
                        address1: selectedShippingAddress.address1,
                        address2: selectedShippingAddress.address2,
                        city: selectedShippingAddress.city,
                        state: selectedShippingAddress.state,
                        zipCode: selectedShippingAddress.zipCode,
                        country: selectedShippingAddress.country,
                        phone: selectedShippingAddress.phone
                    },
                    billingAddress: {
                        firstName: selectedBillingAddress.firstName,
                        lastName: selectedBillingAddress.lastName,
                        company: selectedBillingAddress.company,
                        address1: selectedBillingAddress.address1,
                        address2: selectedBillingAddress.address2,
                        city: selectedBillingAddress.city,
                        state: selectedBillingAddress.state,
                        zipCode: selectedBillingAddress.zipCode,
                        country: selectedBillingAddress.country,
                        phone: selectedBillingAddress.phone
                    },
                    paymentMethodId: selectedPaymentMethod.id
                };

                const createdOrder = await orderService.createOrder(orderData);

                // Clear the cart after successful order
                await clearCart();
                toast.success('Order placed successfully!');

                // Pass order data to confirmation page
                navigate('/order-confirmation', {
                    state: {
                        orderId: createdOrder.id,
                        orderSummary,
                        shippingAddress: selectedShippingAddress,
                        billingAddress: selectedBillingAddress,
                        paymentMethod: selectedPaymentMethod
                    }
                });
            } else {
                throw new Error('Payment failed');
            }
        } catch (error: any) {
            console.error('Error placing order:', error);
            toast.error(error.message || 'Failed to place order');
            setCurrentStep('review');
        } finally {
            setIsProcessing(false);
        }
    };

    const calculateOrderTotal = () => {
        const subtotal = totalPrice;
        const shipping = subtotal > 50 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        return {
            subtotal,
            shipping,
            tax,
            total: subtotal + shipping + tax
        };
    };

    const orderTotal = calculateOrderTotal();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                            <p className="text-gray-600 mt-1">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'} • ${orderTotal.total.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Step 1: Address Selection */}
                        {currentStep === 'address' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Shipping & Billing Address
                                </h2>

                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
                                        <button
                                            onClick={() => setShowAddressForm({ type: 'shipping' })}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add New
                                        </button>
                                    </div>

                                    {loadingAddresses ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                            <span className="ml-2 text-gray-600">Loading addresses...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {addresses
                                                .filter(addr => addr.type === 'shipping')
                                                .map(address => (
                                                    <div
                                                        key={address.id}
                                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedShippingAddress?.id === address.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        onClick={() => setSelectedShippingAddress(address)}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        checked={selectedShippingAddress?.id === address.id}
                                                                        onChange={() => setSelectedShippingAddress(address)}
                                                                        className="h-4 w-4 text-blue-600"
                                                                    />
                                                                    <span className="font-medium text-gray-900">
                                                                        {address.firstName} {address.lastName}
                                                                    </span>
                                                                    {address.isDefault && (
                                                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                                            Default
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {address.address1}
                                                                    {address.address2 && `, ${address.address2}`}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {address.city}, {address.state} {address.zipCode}
                                                                </p>
                                                                <p className="text-sm text-gray-600">{address.country}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShowAddressForm({ type: 'shipping', address });
                                                                    }}
                                                                    className="text-gray-400 hover:text-gray-600"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteAddress(address.id!);
                                                                    }}
                                                                    className="text-gray-400 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                {/* Billing Address */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                                        <button
                                            onClick={() => setShowAddressForm({ type: 'billing' })}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add New
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {addresses
                                            .filter(addr => addr.type === 'billing')
                                            .map(address => (
                                                <div
                                                    key={address.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedBillingAddress?.id === address.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setSelectedBillingAddress(address)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    checked={selectedBillingAddress?.id === address.id}
                                                                    onChange={() => setSelectedBillingAddress(address)}
                                                                    className="h-4 w-4 text-blue-600"
                                                                />
                                                                <span className="font-medium text-gray-900">
                                                                    {address.firstName} {address.lastName}
                                                                </span>
                                                                {address.isDefault && (
                                                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {address.address1}
                                                                {address.address2 && `, ${address.address2}`}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {address.city}, {address.state} {address.zipCode}
                                                            </p>
                                                            <p className="text-sm text-gray-600">{address.country}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowAddressForm({ type: 'billing', address });
                                                                }}
                                                                className="text-gray-400 hover:text-gray-600"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteAddress(address.id!);
                                                                }}
                                                                className="text-gray-400 hover:text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={!selectedShippingAddress || !selectedBillingAddress}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Method Selection */}
                        {currentStep === 'payment' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Payment Method
                                    </h2>
                                    <button
                                        onClick={() => setCurrentStep('address')}
                                        className="text-gray-600 hover:text-gray-900 text-sm"
                                    >
                                        ← Back to Address
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Saved Payment Methods</h3>
                                        <button
                                            onClick={() => setShowPaymentForm({})}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add New
                                        </button>
                                    </div>

                                    {loadingPaymentMethods ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                            <span className="ml-2 text-gray-600">Loading payment methods...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {paymentMethods.map(method => (
                                                <div
                                                    key={method.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod?.id === method.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setSelectedPaymentMethod(method)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <input
                                                                type="radio"
                                                                checked={selectedPaymentMethod?.id === method.id}
                                                                onChange={() => setSelectedPaymentMethod(method)}
                                                                className="h-4 w-4 text-blue-600"
                                                            />
                                                            <div className="flex items-center space-x-2">
                                                                <CreditCard className="w-5 h-5 text-gray-400" />
                                                                <span className="font-medium text-gray-900">
                                                                    {method.brand?.toUpperCase()} •••• {method.last4}
                                                                </span>
                                                                {method.isDefault && (
                                                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm text-gray-500">
                                                                Expires {method.expMonth}/{method.expYear}
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeletePaymentMethod(method.id);
                                                                }}
                                                                className="text-gray-400 hover:text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleProceedToReview}
                                        disabled={!selectedPaymentMethod}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Review Order
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Order Review */}
                        {currentStep === 'review' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Review Your Order
                                    </h2>
                                    <button
                                        onClick={() => setCurrentStep('payment')}
                                        className="text-gray-600 hover:text-gray-900 text-sm"
                                    >
                                        ← Back to Payment
                                    </button>
                                </div>

                                {/* Order Items */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                                    <div className="space-y-4">
                                        {items.map(item => (
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

                                {/* Shipping Address Review */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                                    {selectedShippingAddress && (
                                        <div className="text-sm text-gray-600">
                                            <p className="font-medium">
                                                {selectedShippingAddress.firstName} {selectedShippingAddress.lastName}
                                            </p>
                                            <p>{selectedShippingAddress.address1}</p>
                                            {selectedShippingAddress.address2 && <p>{selectedShippingAddress.address2}</p>}
                                            <p>
                                                {selectedShippingAddress.city}, {selectedShippingAddress.state} {selectedShippingAddress.zipCode}
                                            </p>
                                            <p>{selectedShippingAddress.country}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method Review */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                                    {selectedPaymentMethod && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <CreditCard className="w-4 h-4" />
                                            <span>
                                                {selectedPaymentMethod.brand?.toUpperCase()} •••• {selectedPaymentMethod.last4}
                                            </span>
                                            <span>Expires {selectedPaymentMethod.expMonth}/{selectedPaymentMethod.expYear}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Processing */}
                        {currentStep === 'processing' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Order</h3>
                                <p className="text-gray-600">Please wait while we process your payment...</p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${orderTotal.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {orderTotal.shipping === 0 ? (
                                            <span className="text-green-600">Free</span>
                                        ) : (
                                            `$${orderTotal.shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${orderTotal.tax.toFixed(2)}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">${orderTotal.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {orderTotal.subtotal > 50 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                    <div className="flex items-center text-green-800">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        <span className="text-sm font-medium">You qualify for free shipping!</span>
                                    </div>
                                </div>
                            )}

                            <div className="text-xs text-gray-500 text-center">
                                <p>🔒 Your payment information is secure and encrypted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Form Modal */}
            {showAddressForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <AddressForm
                            address={showAddressForm.address}
                            type={showAddressForm.type}
                            onSave={handleSaveAddress}
                            onCancel={() => setShowAddressForm(null)}
                            isEditing={!!showAddressForm.address}
                        />
                    </div>
                </div>
            )}

            {/* Payment Method Form Modal */}
            {showPaymentForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <PaymentMethodForm
                            paymentMethod={showPaymentForm.method}
                            onSave={handleSavePaymentMethod}
                            onCancel={() => setShowPaymentForm(null)}
                            isEditing={!!showPaymentForm.method}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
