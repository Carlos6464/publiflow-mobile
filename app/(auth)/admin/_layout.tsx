import { Stack } from 'expo-router';

export default function AdminStackLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: '#221015' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitle: "", 
        }}>
            <Stack.Screen name="index" options={{ title: 'Painel Administrativo' }} />
            
            <Stack.Screen name="posts/index" options={{ title: 'Gerenciar Postagens' }} />
            <Stack.Screen name="posts/form" options={{ title: 'Adicionar/Editar Postagem' }} />
            
            <Stack.Screen name="teachers/index" options={{ title: 'Gerenciar Professores' }} />
            <Stack.Screen name="students/index" options={{ title: 'Gerenciar Alunos' }} />

            <Stack.Screen name="teachers/form" options={{ title: 'Adicionar/Editar Professor' }} />
            <Stack.Screen name="students/form" options={{ title: 'Adicionar/Editar Aluno' }} />
        </Stack>
    );
}