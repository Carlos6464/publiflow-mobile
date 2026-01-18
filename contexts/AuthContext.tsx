// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn(email: string, pass: string, type: 'student' | 'teacher'): Promise<void>;
  signOut(): void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@PubliFlow:user');
      const storageToken = await AsyncStorage.getItem('@PubliFlow:token');

      if (storageUser && storageToken) {
        api.defaults.headers.Authorization = `Bearer ${storageToken}`;
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, password: string, type: string) {
    const response = await api.post('/login', { email, password, type });
    const { token, user: userData } = response.data;

    setUser(userData);
    api.defaults.headers.Authorization = `Bearer ${token}`;

    await AsyncStorage.setItem('@PubliFlow:user', JSON.stringify(userData));
    await AsyncStorage.setItem('@PubliFlow:token', token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);