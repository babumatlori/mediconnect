import { useContext } from "react"
import { ToastContext } from "../context/ToastContext"

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!useContext) {
        throw new Error('useToast must be inside ToastProvider');
    }
    return context;
}
