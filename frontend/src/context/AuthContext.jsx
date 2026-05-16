import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const AuthContext = createContext(null);

const STORAGE_KEY = 'user';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (identifier, password) => {
    const data = await api.login({ identifier, password });
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }
    persistUser(data.user);
    return data.user;
  };

  const signup = async (fields) => {
    const data = await api.signup({
      username: fields.username,
      email: fields.email,
      password: fields.password,
      confirmPassword: fields.confirmPassword,
    });
    if (!data.success) {
      throw new Error(data.message || 'Signup failed');
    }
    return data;
  };

  const verifyEmail = async (email, otp) => {
    const data = await api.verifyEmail({ email, otp });
    if (!data.success) {
      throw new Error(data.message || 'Verification failed');
    }
    persistUser(data.user);
    return data.user;
  };

  const resendVerification = async (email) => {
    const data = await api.resendVerification({ email });
    if (!data.success) {
      throw new Error(data.message || 'Could not resend');
    }
    return data;
  };

  const logout = ({ silent = false } = {}) => {
    persistUser(null);
    if (!silent) {
      navigate('/signin');
    }
  };

  const refreshUser = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    verifyEmail,
    resendVerification,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isVerified: !!user && user.verified !== false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
