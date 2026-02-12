import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create axios instance without auth
const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext({});

// ✅ Export useAuth hook
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set a dummy user to prevent errors in components
    setUser({
      id: 1,
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user'
    });
    setLoading(false);
  }, []);

  // Keep dummy functions to prevent errors
  const login = async () => {
    console.log('Login is disabled (frontend-only mode)');
    return { success: false };
  };

  const register = async () => {
    console.log('Register is disabled (frontend-only mode)');
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    console.log('Logged out');
  };

  const updateProfile = async (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    return { success: true };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    API,
    isAuthenticated: true, // Always authenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { API };