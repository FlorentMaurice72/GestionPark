"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 md:bottom-4" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.2s, transform 0.2s";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-800 dark:text-green-200",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200",
    info: "bg-white border-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200",
  };

  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-md ${colors[toast.type]}`}
    >
      <span className="font-semibold">{icons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100" aria-label="Fermer">×</button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
