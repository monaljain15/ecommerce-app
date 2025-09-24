import React, { useState } from 'react';
import { ProductFilters, ProductCategory, ProductBrand } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSidebarProps {
    filters: ProductFilters;
    onFiltersChange: (filters: ProductFilters) => void;
    categories: ProductCategory[];
    brands: ProductBrand[];
    className?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    onFiltersChange,
    categories,
    brands,
    className = ''
}) => {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        brand: true,
        price: true,
        rating: true
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterChange = (key: keyof ProductFilters, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            search: filters.search,
            page: 1,
            limit: filters.limit
        });
    };

    const FilterSection: React.FC<{
        title: string;
        section: keyof typeof expandedSections;
        children: React.ReactNode;
    }> = ({ title, section, children }) => (
        <div className="border-b border-gray-200 pb-4 mb-4">
            <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
                {title}
                {expandedSections[section] ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>
            {expandedSections[section] && children}
        </div>
    );

    return (
        <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Categories */}
            <FilterSection title="Categories" section="category">
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category.id} className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                checked={filters.category === category.name}
                                onChange={() => handleFilterChange('category', category.name)}
                                className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                                {category.name} ({category.productCount})
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Brands */}
            <FilterSection title="Brands" section="brand">
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center">
                            <input
                                type="radio"
                                name="brand"
                                checked={filters.brand === brand.name}
                                onChange={() => handleFilterChange('brand', brand.name)}
                                className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                                {brand.name} ({brand.productCount})
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" section="price">
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Min Price</label>
                        <input
                            type="number"
                            value={filters.minPrice || ''}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Max Price</label>
                        <input
                            type="number"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="1000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Minimum Rating" section="rating">
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.rating === rating}
                                onChange={() => handleFilterChange('rating', rating)}
                                className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                    >
                                        ★
                                    </span>
                                ))}
                                <span className="ml-2 text-sm text-gray-700">& Up</span>
                            </div>
                        </label>
                    ))}
                </div>
            </FilterSection>
        </div>
    );
};

export default FilterSidebar;
