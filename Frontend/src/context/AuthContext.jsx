/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { api, getToken, setToken, removeToken } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore authenticated user on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          setTokenState(storedToken);
        } else {
          removeToken();
          setTokenState(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to restore auth session:", err.message);
        removeToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.login({ email, password });
      if (response.success && response.token) {
        setToken(response.token);
        setTokenState(response.token);
        setUser(response.user);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await api.register({ name, email, password });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth } from "../hooks/useAuth";
