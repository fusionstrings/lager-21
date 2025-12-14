"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, Check, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
    id: number;
    type: ToastType;
    message: string;
    title?: string;
};

type ToastContextType = {
    showToast: (type: ToastType, message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

const TOAST_ICONS = {
    success: Check,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
} as const;

const TOAST_STYLES = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
} as const;

function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (type: ToastType, message: string, title?: string) => {
            const id = Date.now();
            setToasts((prev) => [...prev, { id, type, message, title }]);

            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 3000);
        },
        [],
    );

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext value={{ showToast }}>
            {children}
            <div className="toast toast-end toast-bottom z-50">
                {toasts.map((toast) => {
                    const Icon = TOAST_ICONS[toast.type];
                    return (
                        <div
                            key={toast.id}
                            className={`alert ${
                                TOAST_STYLES[toast.type]
                            } shadow-lg animate-slide-in-right`}
                        >
                            <Icon className="w-5 h-5" />
                            <div className="flex flex-col">
                                {toast.title && (
                                    <span className="font-semibold text-sm">
                                        {toast.title}
                                    </span>
                                )}
                                <span>{toast.message}</span>
                            </div>
                            <button
                                type="button"
                                className="btn btn-ghost btn-xs btn-circle"
                                onClick={() => removeToast(toast.id)}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext>
    );
}

export { ToastProvider, useToast };
