import React, { useState } from 'react';
import { UserProfile, UpdateProfileData } from '../services/userService';
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    User
} from 'lucide-react';

// List of countries for auto-suggestion
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

interface ProfileDetailsProps {
    profile: UserProfile;
    isEditing: boolean;
    formData: UpdateProfileData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
    profile,
    isEditing,
    formData,
    onInputChange
}) => {
    const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState(countries);

    const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onInputChange(e);

        // Filter countries based on input
        const filtered = countries.filter(country =>
            country.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCountries(filtered);
        setShowCountrySuggestions(value.length > 0 && filtered.length > 0);
    };

    const selectCountry = (country: string) => {
        const event = {
            target: {
                name: 'address.country',
                value: country
            }
        } as React.ChangeEvent<HTMLInputElement>;

        onInputChange(event);
        setShowCountrySuggestions(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {profile.email}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                    </label>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter phone number"
                        />
                    ) : (
                        <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            {profile.phone || 'Not specified'}
                        </div>
                    )}
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date of Birth
                    </label>
                    {isEditing ? (
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ''}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }) : 'Not specified'}
                        </div>
                    )}
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Gender
                    </label>
                    {isEditing ? (
                        <select
                            name="gender"
                            value={formData.gender || 'prefer-not-to-say'}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="prefer-not-to-say">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    ) : (
                        <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg capitalize">
                            {profile.gender?.replace('-', ' ') || 'Not specified'}
                        </div>
                    )}
                </div>
            </div>

            {/* Address Section */}
            <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address?.street || ''}
                                onChange={onInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter street address"
                            />
                        ) : (
                            <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile.address?.street || 'Not specified'}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address?.city || ''}
                                onChange={onInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter city"
                            />
                        ) : (
                            <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile.address?.city || 'Not specified'}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address?.state || ''}
                                onChange={onInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter state"
                            />
                        ) : (
                            <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile.address?.state || 'Not specified'}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address.zipCode"
                                value={formData.address?.zipCode || ''}
                                onChange={onInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter ZIP code"
                            />
                        ) : (
                            <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile.address?.zipCode || 'Not specified'}
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        {isEditing ? (
                            <div className="relative">
                                <input
                                    type="text"
                                    name="address.country"
                                    value={formData.address?.country || ''}
                                    onChange={handleCountryInputChange}
                                    onFocus={() => {
                                        if (formData.address?.country) {
                                            const filtered = countries.filter(country =>
                                                country.toLowerCase().includes(formData.address?.country?.toLowerCase() || '')
                                            );
                                            setFilteredCountries(filtered);
                                            setShowCountrySuggestions(filtered.length > 0);
                                        }
                                    }}
                                    onBlur={() => {
                                        // Delay hiding suggestions to allow clicking on them
                                        setTimeout(() => setShowCountrySuggestions(false), 200);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter country"
                                    autoComplete="off"
                                />
                                {showCountrySuggestions && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {filteredCountries.slice(0, 10).map((country, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => selectCountry(country)}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                            >
                                                {country}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                {profile.address?.country || 'Not specified'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfileDetails;
