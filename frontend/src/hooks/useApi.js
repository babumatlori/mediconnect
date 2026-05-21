import { useCallback, useState } from "react";
import { useToast } from "./useToast";

export const useApi = (apiFunction) => {
    const[data, setData] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);
    const { showError } = useToast();

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiFunction(...args);
                setData(response.data);
                return { success: true, data: response.data };
            } catch (err) {
                const message = err.response?.data?.message || err.message || 'Something went wrong';
                setError(message);
                showError(message);
                return { success: false, message };
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, showError]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
}
