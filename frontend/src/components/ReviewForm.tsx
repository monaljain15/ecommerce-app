import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import { CreateReviewData } from '../services/reviewService';

interface ReviewFormProps {
    productId: string;
    onSubmit: (data: CreateReviewData) => Promise<void>;
    onCancel?: () => void;
    isSubmitting?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    productId,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const [formData, setFormData] = useState({
        rating: 0,
        title: '',
        comment: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
        setErrors(prev => ({ ...prev, rating: '' }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (formData.rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.comment.trim()) {
            newErrors.comment = 'Comment is required';
        } else if (formData.comment.trim().length < 10) {
            newErrors.comment = 'Comment must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in your review');
            return;
        }

        try {
            await onSubmit({
                productId,
                ...formData
            });
            setFormData({ rating: 0, title: '', comment: '' });
            setErrors({});
            toast.success('Review submitted successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit review');
        }
    };

    const handleCancel = () => {
        setFormData({ rating: 0, title: '', comment: '' });
        setErrors({});
        onCancel?.();
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                    </label>
                    <StarRating
                        rating={formData.rating}
                        interactive={true}
                        onRatingChange={handleRatingChange}
                        showText={true}
                        size="lg"
                    />
                    {errors.rating && (
                        <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Review Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Summarize your review in a few words"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                        disabled={isSubmitting}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                {/* Comment */}
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review *
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        value={formData.comment}
                        onChange={handleInputChange}
                        placeholder="Tell others about your experience with this product"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.comment ? 'border-red-300' : 'border-gray-300'
                            }`}
                        disabled={isSubmitting}
                    />
                    <div className="mt-1 flex justify-between text-sm text-gray-500">
                        <span>Minimum 10 characters</span>
                        <span>{formData.comment.length}/500</span>
                    </div>
                    {errors.comment && (
                        <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            <X className="w-4 h-4 mr-2 inline" />
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || formData.rating === 0}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
