import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 'md',
    showText = false,
    interactive = false,
    onRatingChange,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const handleStarClick = (starRating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    const getRatingText = (rating: number): string => {
        const ratingTexts = {
            5: 'Excellent',
            4: 'Good',
            3: 'Average',
            2: 'Poor',
            1: 'Very Poor'
        };
        return ratingTexts[rating as keyof typeof ratingTexts] || '';
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex items-center">
                {Array.from({ length: maxRating }, (_, index) => {
                    const starRating = index + 1;
                    const isFilled = starRating <= rating;
                    const isHalfFilled = starRating === Math.ceil(rating) && rating % 1 !== 0;

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleStarClick(starRating)}
                            disabled={!interactive}
                            className={`${sizeClasses[size]} ${interactive
                                    ? 'cursor-pointer hover:scale-110 transition-transform duration-200'
                                    : 'cursor-default'
                                }`}
                        >
                            <Star
                                className={`${isFilled || isHalfFilled
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    } transition-colors duration-200`}
                            />
                        </button>
                    );
                })}
            </div>
            {showText && (
                <span className={`${textSizeClasses[size]} text-gray-600 ml-2`}>
                    {rating > 0 ? getRatingText(Math.round(rating)) : 'No rating'}
                </span>
            )}
        </div>
    );
};

export default StarRating;
