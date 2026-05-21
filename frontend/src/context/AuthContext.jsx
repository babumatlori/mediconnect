import { createContext, useState, useCallback } from 'react';
import { authApi } from '../api/authApi';
import {
  saveTokens,
  saveUser,
  getUser,
  getToken,
  clearAuth,
  decodeToken,
} from '../utils/tokenUtils';

// import { AuthContext } from '../context/AuthContext';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage — persists across refreshes
  const [user, setUser] = useState(getUser());
  const [isAuthenticated, setIsAuth] = useState(!!getToken());
  const [loading, setLoading] = useState(false);


//    Login function.

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { accessToken, refreshToken, role } = res.data;

      // Decode token to get user id
      const decoded = decodeToken(accessToken);

      const userData = {
        id:    decoded?.userId || decoded?.sub,
        email: res.data.email,
        role,
      };

      // Save to localStorage
      saveTokens(accessToken, refreshToken);
      saveUser(userData);

      // Update state
      setUser(userData);
      setIsAuth(true);

      return { success: true, role };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Invalid email or password',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function.
   * Clears localStorage and resets state.
   */
  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setIsAuth(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
