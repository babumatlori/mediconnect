import { createContext, useCallback } from 'react';
import toast from 'react-hot-toast';

export const ToastContext = createContext(null);


//   ToastProvider wraps react-hot-toast.
export function ToastProvider({ children }) {

  const showSuccess = useCallback((message) => {
    toast.success(message, {
      duration: 3000,
      style: {
        borderRadius: '8px',
        background: '#ECFDF5',
        color: '#065F46',
        border: '1px solid #D1FAE5',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  }, []);

  const showError = useCallback((message) => {
    toast.error(message, {
      duration: 4000,
      style: {
        borderRadius: '8px',
        background: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FEE2E2',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  }, []);

  const showInfo = useCallback((message) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 3000,
      style: {
        borderRadius: '8px',
        background: '#EFF6FF',
        color: '#1E40AF',
        border: '1px solid #DBEAFE',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
    </ToastContext.Provider>
  );
}
