
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types';
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Mock auth functions for frontend development
const mockLogin = async (email: string, password: string, role: UserRole): Promise<{ user: User, token: string }> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  if (email === 'admin@example.com' && password === 'password' && role === 'admin') {
    return {
      user: {
        id: 'admin-123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      token: 'mock-admin-jwt-token'
    };
  }
  
  if (role === 'tutor') {
    return {
      user: {
        id: 'tutor-123',
        name: 'John Doe',
        email: email,
        role: 'tutor',
        profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
        createdAt: new Date().toISOString()
      },
      token: 'mock-tutor-jwt-token'
    };
  }
  
  if (role === 'student') {
    return {
      user: {
        id: 'student-123',
        name: 'Jane Smith',
        email: email,
        role: 'student',
        profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
        createdAt: new Date().toISOString()
      },
      token: 'mock-student-jwt-token'
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegister = async (name: string, email: string, password: string, role: UserRole): Promise<{ user: User, token: string }> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  return {
    user: {
      id: `${role}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    },
    token: `mock-${role}-jwt-token`
  };
};

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
    // Check for stored token and user in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setAuthState({
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await mockLogin(email, password, role);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      toast.success("Logged in successfully!");
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }));
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await mockRegister(name, email, password, role);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      toast.success("Registered successfully!");
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }));
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
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
