import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Tipagem baseada na resposta da sua API
interface APIUser {
  nomeCompleto: string;
  email: string;
  telefone: string;
  papelUsuarioID: number;
}

// Nossa interface interna extendida com a 'role' para facilitar a lógica no front
interface User extends APIUser {
  role: 'teacher' | 'student';
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string, userType: 'student' | 'teacher') => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const [storedUser, storedToken] = await AsyncStorage.multiGet([
        '@PubliFlow:user',
        '@PubliFlow:token',
      ]);

      if (storedUser[1] && storedToken[1]) {
        api.defaults.headers.Authorization = `Bearer ${storedToken[1]}`;
        setUser(JSON.parse(storedUser[1]));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, senha: string) {
    try {
      const response = await api.post('/login', { email, senha });

      const { user: apiUser, token } = response.data;

      console.log(response);

      // LÓGICA DE MAPEAMENTO: Ajuste o ID conforme seu banco de dados
      // Aqui assumimos: 1 = Professor, Qualquer outro = Aluno
      const role = apiUser.papelUsuarioID === 2 ? 'teacher' : 'student';

      const userWithRole: User = {
        ...apiUser,
        role,
      };

      setUser(userWithRole);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      await AsyncStorage.multiSet([
        ['@PubliFlow:user', JSON.stringify(userWithRole)],
        ['@PubliFlow:token', token],
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}