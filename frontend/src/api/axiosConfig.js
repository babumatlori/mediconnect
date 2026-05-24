import axios from 'axios';
import {
    getToken,
    getRefreshToken,
    saveTokens,
    clearAuth,
} from '../utils/tokenUtils';
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/',
    timeout: 30000, //30 sec
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Intercptor auto adds jwt tokens to auth headers

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    // success just pass through
    (response) => response,

    // error check 401, try token refresh
    async (error) => {
        const originalRequest = error.config;

        // if 401 & we havent already tried refreshing
        if (
            error.response?.status === 401 && !originalRequest._retry
        ) {
            // if already refreshing other requests must wait

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
        }


        // Mark as retry to prevent infinite loop
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Get new access token
        const res = await api.post(
          `/api/auth/refresh?refreshToken=${refreshToken}`
        );

        const { accessToken } = res.data;
        saveTokens(accessToken, refreshToken);
        processQueue(null, accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed — log out
        processQueue(refreshError, null);
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

