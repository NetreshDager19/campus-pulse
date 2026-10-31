"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, message?: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, message, type };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => addToast(title, message, "success"),
    [addToast]
  );
  const error = useCallback(
    (title: string, message?: string) => addToast(title, message, "error"),
    [addToast]
  );
  const warning = useCallback(
    (title: string, message?: string) => addToast(title, message, "warning"),
    [addToast]
  );
  const info = useCallback(
    (title: string, message?: string) => addToast(title, message, "info"),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              t.type === "success"
                ? "bg-white dark:bg-slate-900 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                : t.type === "error"
                ? "bg-white dark:bg-slate-900 border-rose-500/30 text-rose-950 dark:text-rose-100"
                : t.type === "warning"
                ? "bg-white dark:bg-slate-900 border-amber-500/30 text-amber-950 dark:text-amber-100"
                : "bg-white dark:bg-slate-900 border-purple-500/30 text-slate-900 dark:text-slate-100"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
              {t.type === "error" && (
                <XCircle className="w-5 h-5 text-rose-500" />
              )}
              {t.type === "warning" && (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
              {t.type === "info" && (
                <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{t.title}</h4>
              {t.message && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {t.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

