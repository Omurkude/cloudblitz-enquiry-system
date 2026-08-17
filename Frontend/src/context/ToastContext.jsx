/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info") => {
      const id = Date.now() + Math.random().toString();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const showSuccess = useCallback(
    (msg) => addToast(msg, "success"),
    [addToast],
  );
  const showError = useCallback((msg) => addToast(msg, "error"), [addToast]);
  const showInfo = useCallback((msg) => addToast(msg, "info"), [addToast]);

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, removeToast }}
    >
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-emerald-500/40 text-emerald-300"
                : toast.type === "error"
                  ? "bg-slate-900/95 border-rose-500/40 text-rose-300"
                  : "bg-slate-900/95 border-indigo-500/40 text-indigo-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400" />
              )}
              <p className="text-sm font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition ml-3 p-0.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export { useToast } from "../hooks/useToast";
