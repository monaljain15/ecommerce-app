import React, { useState } from 'react';
import { PaymentMethod, paymentService, TEST_CARD_NUMBERS } from '../services/paymentService';
import { CreditCard, Save, X, Lock, Eye, EyeOff } from 'lucide-react';

interface PaymentMethodFormProps {
    paymentMethod?: PaymentMethod;
    onSave: (paymentMethodData: {
        type: 'card';
        cardNumber: string;
        expMonth: number;
        expYear: number;
        cvc: string;
        name: string;
    }) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
    paymentMethod,
    onSave,
    onCancel,
    isEditing = false
}) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvc: '',
        name: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showCardNumber, setShowCardNumber] = useState(false);
    const [showCVC, setShowCVC] = useState(false);
    const [cardBrand, setCardBrand] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let processedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const cleaned = value.replace(/\s/g, '');
            if (cleaned.length <= 19) {
                processedValue = cleaned.replace(/(.{4})/g, '$1 ').trim();
                setCardBrand(paymentService.getCardBrand(cleaned));
            }
        }

        // Limit CVC length based on card brand
        if (name === 'cvc') {
            const maxLength = cardBrand === 'amex' ? 4 : 3;
            processedValue = value.slice(0, maxLength);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = 'Card number is required';
        } else if (!paymentService.validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = 'Invalid card number';
        }

        if (!formData.expMonth) {
            newErrors.expMonth = 'Expiry month is required';
        } else if (parseInt(formData.expMonth) < 1 || parseInt(formData.expMonth) > 12) {
            newErrors.expMonth = 'Invalid month';
        }

        if (!formData.expYear) {
            newErrors.expYear = 'Expiry year is required';
        } else if (parseInt(formData.expYear) < new Date().getFullYear()) {
            newErrors.expYear = 'Card has expired';
        }

        if (!formData.cvc.trim()) {
            newErrors.cvc = 'CVC is required';
        } else if (!paymentService.validateCVC(formData.cvc, cardBrand)) {
            newErrors.cvc = `Invalid CVC (${cardBrand === 'amex' ? '4' : '3'} digits required)`;
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Cardholder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({
                type: 'card',
                cardNumber: formData.cardNumber.replace(/\s/g, ''),
                expMonth: parseInt(formData.expMonth),
                expYear: parseInt(formData.expYear),
                cvc: formData.cvc,
                name: formData.name
            });
        }
    };

    const getCardIcon = (brand: string) => {
        switch (brand) {
            case 'visa':
                return '💳';
            case 'mastercard':
                return '💳';
            case 'amex':
                return '💳';
            case 'discover':
                return '💳';
            default:
                return '💳';
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isEditing ? 'Edit' : 'Add'} Payment Method
                </h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Card Number */}
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                    </label>
                    <div className="relative">
                        <input
                            type={showCardNumber ? 'text' : 'password'}
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={23} // 19 digits + 4 spaces
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            {cardBrand && (
                                <span className="text-lg">{getCardIcon(cardBrand)}</span>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowCardNumber(!showCardNumber)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                </div>

                {/* Cardholder Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter cardholder name"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Expiry Date and CVC */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700 mb-1">
                            Month *
                        </label>
                        <select
                            id="expMonth"
                            name="expMonth"
                            value={formData.expMonth}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expMonth ? 'border-red-300' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {String(i + 1).padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        {errors.expMonth && (
                            <p className="mt-1 text-sm text-red-600">{errors.expMonth}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="expYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Year *
                        </label>
                        <select
                            id="expYear"
                            name="expYear"
                            value={formData.expYear}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expYear ? 'border-red-300' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Year</option>
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        {errors.expYear && (
                            <p className="mt-1 text-sm text-red-600">{errors.expYear}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                            CVC *
                        </label>
                        <div className="relative">
                            <input
                                type={showCVC ? 'text' : 'password'}
                                id="cvc"
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvc ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder={cardBrand === 'amex' ? '1234' : '123'}
                                maxLength={4}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCVC(!showCVC)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCVC ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.cvc && (
                            <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                        )}
                    </div>
                </div>

                {/* Test Card Numbers (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">Test Card Numbers:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, cardNumber: TEST_CARD_NUMBERS.visa }))}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Visa: {TEST_CARD_NUMBERS.visa}
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, cardNumber: TEST_CARD_NUMBERS.mastercard }))}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Mastercard: {TEST_CARD_NUMBERS.mastercard}
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, cardNumber: TEST_CARD_NUMBERS.amex }))}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Amex: {TEST_CARD_NUMBERS.amex}
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, cardNumber: TEST_CARD_NUMBERS.declined }))}
                                    className="text-red-600 hover:text-red-800 underline"
                                >
                                    Declined: {TEST_CARD_NUMBERS.declined}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Notice */}
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Your payment information is encrypted and secure. We never store your full card details.</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Update Payment Method' : 'Save Payment Method'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentMethodForm;
