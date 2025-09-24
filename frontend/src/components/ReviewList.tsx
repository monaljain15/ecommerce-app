import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical, Flag, Edit, Trash2, Star } from 'lucide-react';
import StarRating from './StarRating';
import { Review, ReviewSummary } from '../services/reviewService';
import toast from 'react-hot-toast';

interface ReviewListProps {
    reviews: Review[];
    summary: ReviewSummary;
    onHelpful: (reviewId: string) => Promise<void>;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: string) => Promise<void>;
    currentUserId?: string;
    showActions?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
    reviews,
    summary,
    onHelpful,
    onEdit,
    onDelete,
    currentUserId,
    showActions = true
}) => {
    const [helpfulLoading, setHelpfulLoading] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState<string | null>(null);

    const handleHelpful = async (reviewId: string) => {
        try {
            setHelpfulLoading(reviewId);
            await onHelpful(reviewId);
            toast.success('Thank you for your feedback!');
        } catch (error: any) {
            toast.error('Failed to mark review as helpful');
        } finally {
            setHelpfulLoading(null);
        }
    };

    const handleEdit = (review: Review) => {
        onEdit?.(review);
        setShowMenu(null);
    };

    const handleDelete = async (reviewId: string) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await onDelete?.(reviewId);
                toast.success('Review deleted successfully');
            } catch (error: any) {
                toast.error('Failed to delete review');
            }
        }
        setShowMenu(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRatingPercentage = (rating: number) => {
        if (summary.totalReviews === 0) return 0;
        return Math.round((summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution] / summary.totalReviews) * 100);
    };

    return (
        <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Overall Rating */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-2">
                            <span className="text-4xl font-bold text-gray-900 mr-2">
                                {summary.averageRating.toFixed(1)}
                            </span>
                            <div>
                                <StarRating rating={Math.round(summary.averageRating)} size="lg" />
                                <p className="text-sm text-gray-600 mt-1">
                                    Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => {
                            const percentage = getRatingPercentage(rating);
                            return (
                                <div key={rating} className="flex items-center">
                                    <span className="text-sm text-gray-600 w-8">{rating}</span>
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-8 text-right">
                                        {percentage}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={review.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                                        alt={review.userName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                                            {review.isVerifiedPurchase && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <StarRating rating={review.rating} size="sm" />
                                            <span className="text-sm text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Menu */}
                                {showActions && currentUserId === review.userId && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu(showMenu === review.id ? null : review.id)}
                                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {showMenu === review.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleEdit(review)}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Edit className="w-4 h-4 mr-3" />
                                                        Edit Review
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-3" />
                                                        Delete Review
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>

                            {/* Review Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleHelpful(review.id)}
                                        disabled={helpfulLoading === review.id}
                                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        {helpfulLoading === review.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        ) : (
                                            <ThumbsUp className="w-4 h-4" />
                                        )}
                                        <span>Helpful ({review.helpfulCount})</span>
                                    </button>

                                    <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                                        <Flag className="w-4 h-4" />
                                        <span>Report</span>
                                    </button>
                                </div>

                                {review.updatedAt !== review.createdAt && (
                                    <span className="text-xs text-gray-500">
                                        Edited {formatDate(review.updatedAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewList;
