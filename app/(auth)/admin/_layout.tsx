import { Stack } from 'expo-router';

export default function AdminStackLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: '#f31b58' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}>
            <Stack.Screen name="index" options={{ title: 'Painel Administrativo' }} />
            <Stack.Screen name="teachers/index" options={{ title: 'Gerenciar Professores' }} />
            <Stack.Screen name="students/index" options={{ title: 'Gerenciar Alunos' }} />
            <Stack.Screen name="posts/index" options={{ title: 'Gerenciar Postagens' }} />
        </Stack>
    );
}