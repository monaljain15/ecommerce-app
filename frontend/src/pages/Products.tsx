import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, ProductFilters, ProductCategory, ProductBrand, PaginatedResponse } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import toast from 'react-hot-toast';
import { Filter, Grid, List } from 'lucide-react';

const Products: React.FC = () => {
    const { addToCart, items: cartItems } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [brands, setBrands] = useState<ProductBrand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    });
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [filters, setFilters] = useState<ProductFilters>({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
        sortBy: (searchParams.get('sortBy') as any) || 'name',
        sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
        page: 1,
        limit: 12
    });

    const sortOptions = [
        { value: 'name-asc', label: 'Name A-Z' },
        { value: 'name-desc', label: 'Name Z-A' },
        { value: 'price-asc', label: 'Price Low to High' },
        { value: 'price-desc', label: 'Price High to Low' },
        { value: 'rating-desc', label: 'Highest Rated' },
        { value: 'rating-asc', label: 'Lowest Rated' },
        { value: 'createdAt-desc', label: 'Newest First' },
        { value: 'createdAt-asc', label: 'Oldest First' }
    ];

    useEffect(() => {
        loadCategoriesAndBrands();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadCategoriesAndBrands = async () => {
        try {
            const [categoriesData, brandsData] = await Promise.all([
                productService.getCategories(),
                productService.getBrands()
            ]);
            setCategories(categoriesData);
            setBrands(brandsData);
        } catch (err) {
            console.error('Error loading categories and brands:', err);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response: PaginatedResponse<Product> = await productService.getProducts(filters);
            setProducts(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to load products');
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltersChange = (newFilters: ProductFilters) => {
        const updatedFilters = { ...newFilters, page: 1 };
        setFilters(updatedFilters);
        updateURL(updatedFilters);
    };

    const handleSearch = (query: string) => {
        const updatedFilters = { ...filters, search: query, page: 1 };
        setFilters(updatedFilters);
        updateURL(updatedFilters);
    };

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-');
        const updatedFilters = { ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 };
        setFilters(updatedFilters);
        updateURL(updatedFilters);
    };

    const handlePageChange = (page: number) => {
        const updatedFilters = { ...filters, page };
        setFilters(updatedFilters);
        updateURL(updatedFilters);
    };

    const updateURL = (newFilters: ProductFilters) => {
        const params = new URLSearchParams();

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            }
        });

        setSearchParams(params);
    };

    const handleAddToCart = async (product: Product) => {
        try {
            await addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || ''
            });
            toast.success('Item added to cart!');
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        }
    };


    const getCurrentSortValue = () => {
        return `${filters.sortBy}-${filters.sortOrder}`;
    };

    const renderPagination = () => {
        if (pagination.pages <= 1) return null;

        const pages = [];
        const startPage = Math.max(1, pagination.page - 2);
        const endPage = Math.min(pagination.pages, pagination.page + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${i === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
                    <p className="text-gray-600">
                        Showing {products.length} of {pagination.total} products
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <SearchBar
                                value={filters.search || ''}
                                onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                                onSearch={handleSearch}
                                placeholder="Search products..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden bg-white border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                            <SortDropdown
                                value={getCurrentSortValue()}
                                onChange={handleSortChange}
                                options={sortOptions}
                            />
                            <div className="hidden sm:flex bg-white border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            categories={categories}
                            brands={brands}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <ProductList
                            products={products}
                            onAddToCart={handleAddToCart}
                            loading={loading}
                            error={error}
                            className={viewMode === 'list' ? 'grid-cols-1' : ''}
                            showCartControls={true}
                        />

                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
