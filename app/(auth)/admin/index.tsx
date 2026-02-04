import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboard() {
    const router = useRouter();

    const AdminButton = ({ title, icon, route }: { title: string, icon: any, route: string }) => (
        <TouchableOpacity
            // Mudei para bg-surface para criar contraste com o fundo
            // Removi a borda clara e adicionei espaçamento interno
            className="bg-surface p-5 rounded-2xl flex-row items-center mb-4 active:opacity-80"
            onPress={() => router.push(route as any)}
        >
            {/* Ícone com fundo levemente destacado ou escuro */}
            <View className="bg-background-dark p-3 rounded-xl mr-4">
                <Ionicons name={icon} size={24} color="#f31b58" />
            </View>

            <View className="flex-1">
                {/* Texto Branco para ler no escuro */}
                <Text className="text-lg font-bold text-white">{title}</Text>
                <Text className="text-textGray text-sm">Gerenciar registros</Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#8C8C8C" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-background-dark p-6">
            {/* Título da seção */}
            <Text className="text-sm text-primary mb-6 uppercase tracking-wider font-bold mt-4">
                Painel Administrativo
            </Text>

            <AdminButton
                title="Professores"
                icon="school"
                route="/(auth)/admin/teachers"
            />

            <AdminButton
                title="Alunos"
                icon="people"
                route="/(auth)/admin/students"
            />

            <AdminButton
                title="Postagens"
                icon="newspaper"
                route="/(auth)/admin/posts"
            />
        </View>
    );
}