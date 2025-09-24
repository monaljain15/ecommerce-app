import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeNotification, clearOldNotifications } from '../store/slices/uiSlice';
import toast from 'react-hot-toast';

const NotificationSystem: React.FC = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.ui.notifications);

    useEffect(() => {
        // Clear old notifications every 30 seconds
        const interval = setInterval(() => {
            dispatch(clearOldNotifications());
        }, 30000);

        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        notifications.forEach((notification) => {
            // Use a simple toast approach for now
            toast(
                <div>
                    <div className="font-semibold">{notification.title}</div>
                    <div className="text-sm">{notification.message}</div>
                </div>,
                {
                    duration: notification.duration || 4000,
                    id: notification.id,
                }
            );

            // Remove notification from store when toast is dismissed
            const timeout = setTimeout(() => {
                dispatch(removeNotification(notification.id));
            }, notification.duration || 4000);

            return () => clearTimeout(timeout);
        });
    }, [notifications, dispatch]);

    return null; // This component doesn't render anything visible
};

export default NotificationSystem;
