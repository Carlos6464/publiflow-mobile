import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function AuthLayout() {
    const { user } = useAuth();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            // Cores do ícone
            tabBarActiveTintColor: '#f31b58', // Rosa quando selecionado
            tabBarInactiveTintColor: '#8C8C8C', // Cinza quando inativo
            tabBarShowLabel: false, // Sem texto, só ícones (mais limpo)

            // MENU IMPACTANTE
            tabBarStyle: {
                backgroundColor: '#333333', // Cor Surface (cinza chumbo) para destacar do fundo preto
                borderTopWidth: 2,          // Borda grossa
                borderTopColor: '#f31b58',  // COR NEON (Primary)
                elevation: 0,
                height: 70,
                paddingTop: 10,
            }
        }}>

            <Tabs.Screen
                name="feed/index"
                options={{
                    title: 'Feed',
                    // Ícone simples e limpo, sem firulas de background
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={28} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="feed/[id]" // Nome do arquivo que criamos
                options={{
                    href: null, // O SEGREDO: href null remove o botão do menu!
                }}
            />

            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Admin',
                    href: user?.role === 'teacher' ? '/(auth)/admin' : null,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-sharp" size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}