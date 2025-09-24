import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
    loading?: boolean;
    error?: string | null;
    className?: string;
    showCartControls?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    onAddToCart,
    loading = false,
    error = null,
    className = '',
    showCartControls = false
}) => {
    if (loading) {
        return (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 aspect-square rounded-t-lg"></div>
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-red-500 text-lg font-medium mb-2">Error loading products</div>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-gray-500 text-lg font-medium mb-2">No products found</div>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    showCartControls={showCartControls}
                />
            ))}
        </div>
    );
};

export default ProductList;
