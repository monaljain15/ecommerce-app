import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortOption {
    value: string;
    label: string;
}

interface SortDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: SortOption[];
    className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
    value,
    onChange,
    options,
    className = ''
}) => {
    // const selectedOption = options.find(option => option.value === value);

    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    );
};

export default SortDropdown;
