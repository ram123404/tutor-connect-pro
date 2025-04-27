
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types';
import { toast } from "sonner";
import { authAPI, userAPI } from '@/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Check for stored token in localStorage
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      loadUser(storedToken);
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Load user from token
  const loadUser = async (token: string) => {
    try {
      const response = await userAPI.getMe();
      const userData = response.data.data.user;
      
      setAuthState({
        user: userData,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      localStorage.removeItem('token');
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired. Please log in again.'
      });
      
      toast.error('Session expired. Please log in again.');
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authAPI.login({ email, password, role });
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      
      setAuthState({
        user: data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      toast.success("Logged in successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
      
      toast.error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authAPI.register({
        name,
        email,
        password,
        role,
      });
      
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      
      setAuthState({
        user: data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      toast.success("Registered successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      toast.error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    
    toast.success("Logged out successfully!");
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
