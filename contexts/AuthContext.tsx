
import React, { createContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { User } from '../types';
import { useDatabase } from './DatabaseContext';
import { api } from '../services/api';
import CryptoJS from 'crypto-js';

// Proper encryption for localStorage
const SECRET_KEY = 'your-secret-key-change-in-production'; // In production, use environment variable

const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch {
    return data;
  }
};

const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return encryptedData;
  }
};

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { updateUser, loadUserData, clearAdminAndUserData } = useDatabase();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing encrypted session
    const cachedUser = globalThis.localStorage.getItem('auth_user_secure');
    if (!cachedUser) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAuthReady(true);
      return;
    }

    try {
      const decryptedUser = decryptData(cachedUser);
      setUser(JSON.parse(decryptedUser));
    } catch {
      globalThis.localStorage.removeItem('auth_user_secure');
      setUser(null);
      setIsAuthenticated(false);
      setIsAuthReady(true);
      return;
    }

    // Silent validation of current session
    api.me().then(freshUser => {
      setUser(freshUser);
      setIsAuthenticated(true);
      globalThis.localStorage.setItem('auth_user_secure', encryptData(JSON.stringify(freshUser)));
      loadUserData({ includeOrders: false, userRole: freshUser.role }).catch(() => undefined);
      setIsAuthReady(true);
    }).catch(() => {
      globalThis.localStorage.removeItem('auth_user_secure');
      setUser(null);
      setIsAuthenticated(false);
      setIsAuthReady(true);
    });
  }, [loadUserData]);

  const login = useCallback(async (email: string, pass: string): Promise<User | null> => {
    try {
      const logged = await api.login(email, pass);
      setUser(logged);
      setIsAuthenticated(true);
      setIsAuthReady(true);
      globalThis.localStorage.setItem('auth_user_secure', encryptData(JSON.stringify(logged)));
      loadUserData({ includeOrders: false, userRole: logged.role }).catch(() => undefined);
      return logged;
    } catch {
      setIsAuthenticated(false);
      return null;
    }
  }, [loadUserData]);

  const logout = useCallback(() => {
    api.logout().catch(() => undefined);
    setUser(null);
    setIsAuthenticated(false);
    globalThis.localStorage.removeItem('auth_user_secure');
    clearAdminAndUserData();
  }, [clearAdminAndUserData]);

  const register = useCallback(async (name: string, email: string, pass: string) => {
    const created = await api.register(name, email, pass);
    setUser(created);
    setIsAuthenticated(true);
    setIsAuthReady(true);
    loadUserData({ includeOrders: false, userRole: created.role }).catch(() => undefined);
  }, [loadUserData]);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      updateUser(updated);
    }
  }, [updateUser, user]);

  return (
    <AuthContext.Provider value={useMemo(() => ({ user, isAuthReady, isAuthenticated, login, logout, register, updateProfile }), [user, isAuthReady, isAuthenticated, login, logout, register, updateProfile])}>
      {children}
    </AuthContext.Provider>
  );
};
