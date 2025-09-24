import React from 'react';
import { calculatePasswordStrength } from '../utils/validation';

interface PasswordStrengthIndicatorProps {
    password: string;
    className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    password,
    className = ''
}) => {
    const strength = calculatePasswordStrength(password);

    if (!password) {
        return null;
    }

    const getStrengthColor = (color: string) => {
        switch (color) {
            case 'red':
                return 'bg-red-500';
            case 'orange':
                return 'bg-orange-500';
            case 'yellow':
                return 'bg-yellow-500';
            case 'blue':
                return 'bg-blue-500';
            case 'green':
                return 'bg-green-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getTextColor = (color: string) => {
        switch (color) {
            case 'red':
                return 'text-red-600';
            case 'orange':
                return 'text-orange-600';
            case 'yellow':
                return 'text-yellow-600';
            case 'blue':
                return 'text-blue-600';
            case 'green':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className={`mt-2 ${className}`}>
            <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.color)}`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                </div>
                <span className={`text-xs font-medium ${getTextColor(strength.color)}`}>
                    {strength.label}
                </span>
            </div>

            {/* Password requirements checklist */}
            <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        At least 8 characters
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One lowercase letter
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One uppercase letter
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One number
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        One special character
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
