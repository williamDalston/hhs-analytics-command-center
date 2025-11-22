import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                            className={`pointer-events-auto min-w-[300px] p-4 rounded-lg shadow-lg border flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                    toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                        'bg-blue-50 border-blue-200 text-blue-800'
                                }`}
                        >
                            {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0" />}
                            {toast.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0" />}
                            {toast.type === 'info' && <Info className="h-5 w-5 shrink-0" />}

                            <p className="text-sm font-medium flex-1">{toast.message}</p>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
