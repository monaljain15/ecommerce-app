import React, { useState, useEffect } from 'react';
import { Address } from '../services/paymentService';
import { MapPin, Save, X, Plus } from 'lucide-react';

interface AddressFormProps {
    address?: Address;
    type: 'shipping' | 'billing';
    onSave: (address: Omit<Address, 'id'>) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
    address,
    type,
    onSave,
    onCancel,
    isEditing = false
}) => {
    const [formData, setFormData] = useState<Omit<Address, 'id'>>({
        type,
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        isDefault: false
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (address) {
            setFormData({
                type: address.type,
                firstName: address.firstName,
                lastName: address.lastName,
                company: address.company || '',
                address1: address.address1,
                address2: address.address2 || '',
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
                phone: address.phone || '',
                isDefault: address.isDefault || false
            });
        }
    }, [address]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';

        // Phone validation (optional but if provided, should be valid)
        if (formData.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain',
        'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium',
        'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Slovakia', 'Slovenia',
        'Croatia', 'Romania', 'Bulgaria', 'Estonia', 'Latvia', 'Lithuania', 'Japan', 'South Korea',
        'China', 'India', 'Singapore', 'Malaysia', 'Thailand', 'Philippines', 'Indonesia', 'Vietnam',
        'Brazil', 'Argentina', 'Chile', 'Mexico', 'Colombia', 'Peru', 'Uruguay', 'Paraguay',
        'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Tunisia', 'Ghana', 'Ethiopia',
        'New Zealand', 'Israel', 'Turkey', 'Russia', 'Ukraine', 'Belarus', 'Kazakhstan', 'Uzbekistan'
    ].sort();

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {isEditing ? 'Edit' : 'Add'} {type === 'shipping' ? 'Shipping' : 'Billing'} Address
                </h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Company (Optional) */}
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                    </label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name (optional)"
                    />
                </div>

                {/* Address Fields */}
                <div>
                    <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                    </label>
                    <input
                        type="text"
                        id="address1"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address1 ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter street address"
                    />
                    {errors.address1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                    </label>
                    <input
                        type="text"
                        id="address2"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter city"
                        />
                        {errors.city && (
                            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter state"
                        />
                        {errors.state && (
                            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                        </label>
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.zipCode ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter ZIP code"
                        />
                        {errors.zipCode && (
                            <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                        )}
                    </div>
                </div>

                {/* Country and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                        </label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-300' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select country</option>
                            {countries.map(country => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                        {errors.country && (
                            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter phone number (optional)"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Default Address Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        Set as default {type} address
                    </label>
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
                        {isEditing ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
