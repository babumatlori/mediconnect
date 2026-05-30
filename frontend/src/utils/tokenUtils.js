const TOKEN_KEY  =  'mediconnect_token';
const REFRESH_TOKEN = 'mediconnect_refresh';
const USER_KEY = 'mediconnect_user';

// save
export const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const saveUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Read

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const getUser = () => {
    try {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

// Decode JWT payload

export const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        // atob() converts Base64 to string
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

// check if token is expired

export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if(!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
};

// clear all auth data
export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_KEY);
};

