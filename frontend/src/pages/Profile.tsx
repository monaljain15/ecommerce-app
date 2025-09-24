import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService, UserProfile, UpdateProfileData } from '../services/userService';
import { paymentService, Address, PaymentMethod } from '../services/paymentService';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import ProfileDetails from '../components/ProfileDetails';
import ChangePassword from '../components/ChangePassword';
import AddressForm from '../components/AddressForm';
import PaymentMethodForm from '../components/PaymentMethodForm';
import toast from 'react-hot-toast';
import {
    User,
    Edit3,
    Save,
    X,
    Loader2,
    Briefcase,
    Clock,
    MapPin,
    CreditCard,
    Plus,
    Trash2
} from 'lucide-react';

const Profile: React.FC = () => {
    const { user: authUser, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<UpdateProfileData>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Address and Payment Method states
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showAddressForm, setShowAddressForm] = useState<{ type: 'shipping' | 'billing'; address?: Address } | null>(null);
    const [showPaymentForm, setShowPaymentForm] = useState<{ method?: PaymentMethod } | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payment'>('profile');

    useEffect(() => {
        if (isAuthenticated) {
            loadProfile();
            loadAddresses();
            loadPaymentMethods();
        }
    }, [isAuthenticated]);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const profileData = await userService.getProfile();
            setProfile(profileData);
            setFormData({
                name: profileData.name,
                phone: profileData.phone || '',
                address: profileData.address || {},
                dateOfBirth: profileData.dateOfBirth || '',
                gender: profileData.gender || 'prefer-not-to-say',
            });
        } catch (error: any) {
            console.error('Error loading profile:', error);
            toast.error(error.response?.data?.message || 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const loadAddresses = async () => {
        try {
            const addressList = await paymentService.getAddresses();
            setAddresses(addressList);
        } catch (error: any) {
            console.error('Error loading addresses:', error);
            toast.error('Failed to load addresses');
        }
    };

    const loadPaymentMethods = async () => {
        try {
            const methods = await paymentService.getPaymentMethods();
            setPaymentMethods(methods);
        } catch (error: any) {
            console.error('Error loading payment methods:', error);
            toast.error('Failed to load payment methods');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const updatedProfile = await userService.updateProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name,
                phone: profile.phone || '',
                address: profile.address || {},
                dateOfBirth: profile.dateOfBirth || '',
                gender: profile.gender || 'prefer-not-to-say',
            });
        }
        setErrors({});
        setIsEditing(false);
    };

    const handleAvatarChange = (avatarUrl: string) => {
        if (profile) {
            setProfile({
                ...profile,
                avatar: avatarUrl,
            });
        }
    };

    // Address handlers
    const handleSaveAddress = async (addressData: Omit<Address, 'id'>) => {
        try {
            if (showAddressForm?.address) {
                const updatedAddress = await paymentService.updateAddress(showAddressForm.address.id!, addressData);
                setAddresses(prev => prev.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
                toast.success('Address updated successfully');
            } else {
                const newAddress = await paymentService.saveAddress(addressData);
                setAddresses(prev => [...prev, newAddress]);
                toast.success('Address saved successfully');
            }
            setShowAddressForm(null);
        } catch (error: any) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await paymentService.deleteAddress(addressId);
                setAddresses(prev => prev.filter(addr => addr.id !== addressId));
                toast.success('Address deleted successfully');
            } catch (error: any) {
                console.error('Error deleting address:', error);
                toast.error('Failed to delete address');
            }
        }
    };

    // Payment method handlers
    const handleSavePaymentMethod = async (paymentData: any) => {
        try {
            const newMethod = await paymentService.savePaymentMethod(paymentData);
            setPaymentMethods(prev => [...prev, newMethod]);
            toast.success('Payment method saved successfully');
            setShowPaymentForm(null);
        } catch (error: any) {
            console.error('Error saving payment method:', error);
            toast.error('Failed to save payment method');
        }
    };

    const handleDeletePaymentMethod = async (methodId: string) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            try {
                await paymentService.deletePaymentMethod(methodId);
                setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
                toast.success('Payment method deleted successfully');
            } catch (error: any) {
                console.error('Error deleting payment method:', error);
                toast.error('Failed to delete payment method');
            }
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
                    <p className="text-gray-600">You need to be authenticated to access this page.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
                    <p className="text-gray-600">Unable to load your profile information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
                        </div>
                        <div className="flex space-x-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'addresses'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Addresses
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('payment')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Payment Methods
                                </div>
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Avatar, Change Password */}
                                <div className="lg:col-span-1 space-y-8">
                                    <ProfilePictureUpload
                                        currentAvatar={profile.avatar}
                                        onAvatarChange={handleAvatarChange}
                                    />

                                    <div>
                                        <button
                                            onClick={() => setShowChangePassword(!showChangePassword)}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Change Password</span>
                                        </button>
                                    </div>

                                    {showChangePassword && (
                                        <div className="mt-6">
                                            <ChangePassword
                                                onSuccess={() => setShowChangePassword(false)}
                                                onCancel={() => setShowChangePassword(false)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Profile Details */}
                                <div className="lg:col-span-2">
                                    <ProfileDetails
                                        profile={profile}
                                        isEditing={isEditing}
                                        formData={formData}
                                        onInputChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setShowAddressForm({ type: 'shipping' })}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Shipping Address
                                        </button>
                                        <button
                                            onClick={() => setShowAddressForm({ type: 'billing' })}
                                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Billing Address
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.map(address => (
                                        <div key={address.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {address.firstName} {address.lastName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 capitalize">{address.type} Address</p>
                                                    {address.isDefault && (
                                                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setShowAddressForm({ type: address.type, address })}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(address.id!)}
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <p>{address.address1}</p>
                                                {address.address2 && <p>{address.address2}</p>}
                                                <p>{address.city}, {address.state} {address.zipCode}</p>
                                                <p>{address.country}</p>
                                                {address.phone && <p>{address.phone}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Methods Tab */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Saved Payment Methods</h3>
                                    <button
                                        onClick={() => setShowPaymentForm({})}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Payment Method
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <CreditCard className="w-6 h-6 text-gray-400" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {method.brand?.toUpperCase()} •••• {method.last4}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Expires {method.expMonth}/{method.expYear}
                                                        </p>
                                                        {method.isDefault && (
                                                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDeletePaymentMethod(method.id)}
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
                        )}
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

export default Profile;