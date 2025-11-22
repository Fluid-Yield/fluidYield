"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastOptions {
  title?: string;
  description: string;
  variant?: ToastVariant;
}

interface Toast extends ToastOptions {
  id: number;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId++;
    const variant: ToastVariant = options.variant ?? "info";

    setToasts((current) => [...current, { id, variant, ...options }]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "min-w-[260px] max-w-sm rounded-md border px-4 py-3 text-sm shadow-lg bg-[#050b0c]/95 border-[#EDFCFE0F] text-[#E7FDFF]",
              t.variant === "success" && "border-emerald-500/70",
              t.variant === "error" && "border-red-500/70"
            )}
          >
            {t.title && (
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#89A8AA]">
                {t.title}
              </p>
            )}
            <p className="text-[13px] leading-relaxed">{t.description}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
