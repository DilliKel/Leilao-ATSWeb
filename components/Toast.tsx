import React, { useEffect } from "react";

export interface ToastItem {
    id: number;
    message: string;
}

interface ToastProps {
    notifications: ToastItem[];
    onDismiss: (id: number) => void;
}

const TOAST_DURATION_MS = 4000;

const ToastMessage: React.FC<{ notification: ToastItem; onDismiss: (id: number) => void }> = ({
    notification,
    onDismiss,
}) => {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(notification.id), TOAST_DURATION_MS);
        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    return (
        <div className="bg-red-700 text-white px-4 py-3 rounded shadow-lg max-w-xs">
            {notification.message}
        </div>
    );
};

const Toast: React.FC<ToastProps> = ({ notifications, onDismiss }) => {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            {notifications.map((notification) => (
                <ToastMessage key={notification.id} notification={notification} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

export default Toast;
