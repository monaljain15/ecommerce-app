import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { RootState, AppDispatch } from '../store';
import { fetchFavorites } from '../store/slices/favoritesSlice';

const FavoritesLoader: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { favorites, isLoading } = useSelector((state: RootState) => (state as any).favorites);

    useEffect(() => {
        if (user && !isLoading && favorites.length === 0) {
            dispatch(fetchFavorites(user.id));
        }
    }, [dispatch, user, isLoading, favorites.length]);

    return null; // This component doesn't render anything
};

export default FavoritesLoader;
