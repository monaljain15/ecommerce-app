import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../types';
import { Review } from '../services/reviewService';
import { productService } from '../services/productService';
import { reviewService, ReviewSummary, CreateReviewData } from '../services/reviewService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { RootState, AppDispatch } from '../store';
import { addToFavorites, removeFromFavoritesByProductId, fetchFavorites } from '../store/slices/favoritesSlice';
import toast from 'react-hot-toast';
import { Star, ShoppingCart, Heart, Minus, Plus, Check, Truck, Shield, RotateCcw, MessageSquare, Star as StarIcon } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';

const ProductDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const { addToCart, items: cartItems } = useCart();
    const { user } = useAuth();
    const { favorites } = useSelector((state: RootState) => (state as any).favorites);

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [canReview, setCanReview] = useState(false);

    const isInWishlist = product ? favorites.some((fav: any) => fav.productId === product.id) : false;

    useEffect(() => {
        if (id) {
            loadProduct();
            loadReviews();
            loadReviewSummary();
            checkCanReview();
        }
    }, [id, user]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const productData = await productService.getProduct(id!);
            setProduct(productData);
        } catch (err) {
            setError('Product not found');
            console.error('Error loading product:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async () => {
        if (!id) return;

        try {
            setReviewsLoading(true);
            const reviewsData = await reviewService.getProductReviews(id);
            setReviews(reviewsData.reviews);
        } catch (error: any) {
            console.error('Error loading reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setReviewsLoading(false);
        }
    };

    const loadReviewSummary = async () => {
        if (!id) return;

        try {
            const summary = await reviewService.getProductReviewSummary(id);
            setReviewSummary(summary);
        } catch (error: any) {
            console.error('Error loading review summary:', error);
        }
    };

    const checkCanReview = async () => {
        if (!id || !user) {
            setCanReview(false);
            return;
        }

        try {
            const canReviewProduct = await reviewService.canUserReviewProduct(id, user.id);
            setCanReview(canReviewProduct);
        } catch (error: any) {
            console.error('Error checking review eligibility:', error);
            setCanReview(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            setIsAddingToCart(true);

            // Add multiple quantities to cart
            for (let i = 0; i < quantity; i++) {
                await addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || ''
                });
            }

            toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleReviewSubmit = async (data: CreateReviewData) => {
        if (!id) return;

        try {
            setIsSubmittingReview(true);
            await reviewService.createReview({
                ...data,
                productId: id
            });

            // Reload reviews and summary
            await Promise.all([
                loadReviews(),
                loadReviewSummary(),
                checkCanReview()
            ]);

            setShowReviewForm(false);
        } catch (error: any) {
            console.error('Error submitting review:', error);
            throw error; // Re-throw to let ReviewForm handle the error
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleReviewHelpful = async (reviewId: string) => {
        try {
            await reviewService.markReviewHelpful(reviewId);
            await loadReviews(); // Reload to get updated helpful count
        } catch (error: any) {
            console.error('Error marking review as helpful:', error);
            throw error;
        }
    };

    const handleReviewEdit = (review: Review) => {
        // TODO: Implement edit functionality
        console.log('Edit review:', review);
    };

    const handleReviewDelete = async (reviewId: string) => {
        try {
            await reviewService.deleteReview(reviewId);
            await Promise.all([
                loadReviews(),
                loadReviewSummary(),
                checkCanReview()
            ]);
        } catch (error: any) {
            console.error('Error deleting review:', error);
            throw error;
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            toast.error('Please log in to add favorites');
            return;
        }

        if (!product) return;

        try {
            if (isInWishlist) {
                await dispatch(removeFromFavoritesByProductId(product.id)).unwrap();
                toast.success('Removed from favorites');
            } else {
                await dispatch(addToFavorites({ productId: product.id })).unwrap();
                toast.success('Added to favorites!');
            }
        } catch (error: any) {
            console.error('Error toggling wishlist:', error);
            toast.error('Failed to update favorites');
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <Link
                            to="/products"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-blue-600">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white">
                            <img
                                src={product.images?.[selectedImage] || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 overflow-hidden rounded-lg border-2 ${selectedImage === index
                                            ? 'border-blue-600'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between h-full">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

                                <div className="flex items-center gap-4 mb-4">
                                    <StarRating
                                        rating={reviewSummary?.averageRating || product.rating}
                                        size="md"
                                        showText={true}
                                    />
                                    <span className="text-sm text-gray-600">
                                        {reviewSummary?.totalReviews || product.reviewCount} review{(reviewSummary?.totalReviews || product.reviewCount) !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="text-3xl font-bold text-gray-900 mb-4">
                                    ${product.price.toFixed(2)}
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    {product.stock > 0 ? (
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                            <Check className="w-4 h-4" />
                                            In Stock ({product.stock} available)
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Out of Stock</span>
                                    )}
                                </div>
                            </div>

                            {/* Product Highlights */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        High-quality materials
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Premium design
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Excellent customer reviews
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Fast shipping available
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="space-y-4 mt-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="p-2 hover:bg-gray-50"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || isAddingToCart}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleToggleWishlist}
                                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Truck className="w-4 h-4" />
                                    Free Shipping
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Shield className="w-4 h-4" />
                                    1 Year Warranty
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <RotateCcw className="w-4 h-4" />
                                    30 Day Returns
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description and Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Description */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Reviews ({reviews.length})
                                </h2>
                                {canReview && (
                                    <button
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        <StarIcon className="w-4 h-4 mr-2" />
                                        {showReviewForm ? 'Cancel' : 'Write Review'}
                                    </button>
                                )}
                            </div>

                            {/* Review Form */}
                            {showReviewForm && canReview && (
                                <div className="mb-6">
                                    <ReviewForm
                                        productId={id!}
                                        onSubmit={handleReviewSubmit}
                                        onCancel={() => setShowReviewForm(false)}
                                        isSubmitting={isSubmittingReview}
                                    />
                                </div>
                            )}

                            {/* Reviews List */}
                            {reviewSummary && (
                                <ReviewList
                                    reviews={reviews}
                                    summary={reviewSummary}
                                    onHelpful={handleReviewHelpful}
                                    onEdit={handleReviewEdit}
                                    onDelete={handleReviewDelete}
                                    currentUserId={user?.id}
                                    showActions={!!user}
                                />
                            )}

                            {reviewsLoading && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading reviews...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Brand:</span>
                                    <span className="text-gray-900">{product.brand}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="text-gray-900">{product.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">SKU:</span>
                                    <span className="text-gray-900">{product.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Stock:</span>
                                    <span className="text-gray-900">{product.stock} units</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Shipping Info</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Free shipping on orders over $50</p>
                                <p>• Standard delivery: 3-5 business days</p>
                                <p>• Express delivery: 1-2 business days</p>
                                <p>• International shipping available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
