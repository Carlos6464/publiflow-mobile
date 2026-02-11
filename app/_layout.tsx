import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import Toast from 'react-native-toast-message';
import { useEffect } from "react";
import '../global.css';

function RootLayoutNav() {
  const { signed, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (signed && !inAuthGroup) {
      // Se está logado, manda para a área logada
      router.replace("/(auth)/feed");
    } else if (!signed && inAuthGroup) {
      // Se não está logado, manda voltar para o login
      router.replace("/");
    }
  }, [signed, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aqui ele carrega o arquivo index.tsx como a tela inicial */}
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
      <Toast />
    </AuthProvider>
  );
}