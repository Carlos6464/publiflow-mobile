import { Stack } from 'expo-router';

export default function AdminStackLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: '#221015' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            // CORREÇÃO: Usar headerBackTitle vazia em vez de headerBackTitleVisible
            headerBackTitle: "", 
        }}>
            <Stack.Screen name="index" options={{ title: 'Painel Administrativo' }} />
            
            <Stack.Screen name="posts/index" options={{ title: 'Gerenciar Postagens' }} />
            <Stack.Screen name="posts/form" options={{ title: 'Editor de Postagem' }} />
            
            <Stack.Screen name="teachers/index" options={{ title: 'Gerenciar Professores' }} />
            <Stack.Screen name="students/index" options={{ title: 'Gerenciar Alunos' }} />
        </Stack>
    );
}