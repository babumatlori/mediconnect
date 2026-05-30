import { createContext, useState, useCallback } from 'react';
import { authApi } from '../api/authApi';
import {
  saveTokens, saveUser,
  getToken, getUser,
  clearAuth, decodeToken,
} from '../utils/tokenUtils';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // Read initial state from localStorage
  // This runs once when app starts
  // If user refreshes page — state is restored from localStorage
  const [user, setUser] = useState(() => getUser());
  const [isAuthenticated, setIsAuth] = useState(() => {
    const token = getToken();
    const user  = getUser();
    return !!(token && user);
  });
  const [loading, setLoading] = useState(false);

const login = useCallback(async (email, password) => {
  setLoading(true);

  try {
    const res = await authApi.login({ email, password });

    const { accessToken, refreshToken, role } = res.data;

    const decoded = decodeToken(accessToken);

    const userData = {
      id: decoded?.userId,
      email: res.data.email,
      role,
    };

    saveTokens(accessToken, refreshToken);
    saveUser(userData);

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

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setIsAuth(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
