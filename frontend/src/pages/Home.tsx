import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import ProductList from '../components/ProductList';
import toast from 'react-hot-toast';
import { ShoppingCart, Truck, Shield, Headphones } from 'lucide-react';

const Home: React.FC = () => {
    const { addToCart } = useCart();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFeaturedProducts = async () => {
            try {
                setLoading(true);
                const products = await productService.getFeaturedProducts(6);
                setFeaturedProducts(products);
            } catch (err) {
                setError('Failed to load featured products');
                console.error('Error loading featured products:', err);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProducts();
    }, []);

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


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Welcome to Our Ecommerce Store
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            Discover amazing products at great prices with fast shipping and excellent customer service.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Shop Now
                            </Link>
                            <Link
                                to="/products?featured=true"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
                            >
                                Featured Products
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Discover our most popular and highly-rated products
                        </p>
                    </div>

                    <ProductList
                        products={featuredProducts}
                        onAddToCart={handleAddToCart}
                        loading={loading}
                        error={error}
                        showCartControls={true}
                    />

                    <div className="text-center mt-12">
                        <Link
                            to="/products"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 border-t-4 border-b-4" style={{ backgroundColor: '#e0f2fe', borderTopColor: '#e0f2fe', borderBottomColor: '#e0f2fe', minHeight: '400px' }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-lg text-gray-700">We're committed to providing the best shopping experience</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Quality Products</h3>
                            <p className="text-gray-600">
                                We offer only the highest quality products from trusted brands with warranty coverage.
                            </p>
                        </div>
                        <div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Fast Shipping</h3>
                            <p className="text-gray-600">
                                Get your orders delivered quickly with our fast and reliable shipping options.
                            </p>
                        </div>
                        <div className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">24/7 Support</h3>
                            <p className="text-gray-600">
                                Our customer support team is always here to help you with any questions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
                            <p className="text-xl mb-8 opacity-90">
                                Subscribe to our newsletter for the latest products and exclusive offers
                            </p>
                            <div className="max-w-md mx-auto">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
