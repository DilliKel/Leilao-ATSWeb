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
        <div className="flex max-w-xs animate-fade-in items-start gap-2 rounded-lg border border-amber-400/20 border-l-4 border-l-amber-400 bg-zinc-900/90 px-4 py-3 text-sm text-zinc-100 shadow-2xl backdrop-blur-md">
            <p className="flex-1">{notification.message}</p>
            <button
                onClick={() => onDismiss(notification.id)}
                className="text-zinc-500 transition hover:text-zinc-200"
                aria-label="Fechar"
            >
                ✕
            </button>
        </div>
    );
};

const Toast: React.FC<ToastProps> = ({ notifications, onDismiss }) => {
    return (
        <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
            {notifications.map((notification) => (
                <ToastMessage key={notification.id} notification={notification} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

export default Toast;
