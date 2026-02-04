import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function Login() {
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Pegamos a função de login do nosso contexto
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      // Chama a função que conecta na API
      await signIn(email, password, userType);
    } catch (err) {
      Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background-dark">
      <View className="flex-1 px-6 justify-center items-center">

        {/* Header */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center shadow-xl">
            <Text className="text-white text-3xl">📖</Text>
          </View>
          <Text className="text-white text-3xl font-bold mt-4">PubliFlow</Text>
          <Text className="text-textGray text-sm">Sua comunidade acadêmica</Text>
        </View>

        {/* User Type Switcher */}
        <View className="flex-row bg-surface p-1.5 rounded-2xl mb-8 w-full">
          <TouchableOpacity
            onPress={() => setUserType('student')}
            className={`flex-1 py-3 rounded-xl ${userType === 'student' ? 'bg-primary' : ''}`}>
            <Text className="text-white text-center font-semibold">Sou Aluno</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUserType('teacher')}
            className={`flex-1 py-3 rounded-xl ${userType === 'teacher' ? 'bg-primary' : ''}`}>
            <Text className="text-white text-center font-semibold">Sou Professor</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View className="w-full space-y-5">
          <View>
            <Text className="text-textGray text-xs font-bold uppercase mb-2 ml-1">Email</Text>
            <View className="flex-row items-center bg-surface rounded-xl px-4 h-14">
              <Mail color="#8C8C8C" size={20} />
              <TextInput
                className="flex-1 ml-3 text-white"
                placeholder="exemplo@universidade.edu.br"
                placeholderTextColor="#8C8C8C"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View>
            <Text className="text-textGray text-xs font-bold uppercase mb-2 ml-1">Senha</Text>
            <View className="flex-row items-center bg-surface rounded-xl px-4 h-14">
              <Lock color="#8C8C8C" size={20} />
              <TextInput
                className="flex-1 ml-3 text-white"
                placeholder="••••••••"
                placeholderTextColor="#8C8C8C"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-primary h-14 rounded-xl flex-row items-center justify-center mt-4 shadow-lg shadow-primary/20">
            <Text className="text-white font-bold text-lg mr-2">Entrar</Text>
            <ArrowRight color="white" size={20} />
          </TouchableOpacity>
        </View>

        {/* --- DIVISOR VISUAL ADICIONADO AQUI --- */}
        <View className="w-full h-[1px] bg-surface/50 my-8" />

        {/* Footer */}
        <View className="items-center">
          <Text className="text-textGray">
            Ainda não possui acesso? <Text className="text-primary font-bold">Cadastre-se</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}