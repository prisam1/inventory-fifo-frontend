import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, AuthState } from '../types';
import * as authApi from '../api/auth';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
 
  const storedUser = localStorage.getItem('user');
  let initialUser: User | null = null;
  if (storedUser && storedUser !== 'undefined') {  
    try {
      initialUser = JSON.parse(storedUser);
    } catch (e) {
      console.error("Error:", e);
      localStorage.removeItem('user');  
    }
  }
 

  const [authState, setAuthState] = useState<AuthState>({
    token: localStorage.getItem('token') || null,
    user: initialUser,  
    isAuthenticated: !!localStorage.getItem('token'),
    loading: true,
  });

  useEffect(() => {
    if (authState.token && !authState.isAuthenticated) {
      setAuthState((prev) => ({ ...prev, isAuthenticated: true }));
    }
    setAuthState((prev) => ({ ...prev, loading: false }));
  }, [authState.token, authState.isAuthenticated]);

  const login = async (credentials: any): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));  
      setAuthState({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};