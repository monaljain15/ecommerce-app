import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    onSearch,
    placeholder = 'Search products...',
    className = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        onChange('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`relative ${className}`}>
            <div className={`relative flex items-center bg-white border rounded-lg transition-colors duration-200 ${isFocused ? 'border-blue-500 shadow-md' : 'border-gray-300'
                }`}>
                <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border-0 rounded-lg focus:outline-none focus:ring-0"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchBar;
