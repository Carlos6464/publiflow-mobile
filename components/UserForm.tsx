import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { userService } from '../services/userService';

interface UserFormProps {
    id?: string;       // ID vindo da URL (opcional)
    roleId: number;    // 1 ou 2
    roleName: string;  // "Aluno" ou "Professor"
}

export default function UserForm({ id, roleId, roleName }: UserFormProps) {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            userService.getById(id)
                .then((user) => {
                    const parts = user.nomeCompleto.split(' ');
                    setFirstName(parts[0] || '');
                    setLastName(parts.slice(1).join(' ') || '');
                    setEmail(user.email);
                    setTelefone(user.telefone);
                })
                .catch(() => Toast.show({ type: 'error', text1: 'Erro', text2: 'Usuário não encontrado.' }))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSave = async () => {
        if (!firstName || !lastName || !email || !telefone) {
            return Toast.show({ type: 'info', text1: 'Atenção', text2: 'Preencha todos os campos obrigatórios.' });
        }

        if (!id && !senha) {
            return Toast.show({ type: 'info', text1: 'Atenção', text2: 'Senha é obrigatória para novos usuários.' });
        }

        setLoading(true);

        try {
            const payload: any = {
                firstName,
                lastName,
                email,
                telefone,
                papelUsuarioID: roleId
            };

            if (senha) payload.senha = senha;

            if (id) {
                await userService.update(Number(id), payload);
                Toast.show({ type: 'success', text1: 'Sucesso', text2: `${roleName} atualizado!` });
            } else {
                await userService.create(payload);
                Toast.show({ type: 'success', text1: 'Sucesso', text2: `${roleName} cadastrado!` });
            }
            router.back();

        } catch (error: any) {
            const msg = error.response?.data?.message || "Erro ao salvar.";
            Toast.show({ type: 'error', text1: 'Erro', text2: Array.isArray(msg) ? msg[0] : msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-background-dark p-6">
            <Text className="text-2xl font-bold text-white mb-6">
                {id ? `Editar ${roleName}` : `Novo ${roleName}`}
            </Text>

            <View className="space-y-4">
                <View>
                    <Text className="text-textGray mb-2 font-bold">Nome</Text>
                    <TextInput className="bg-surface text-white p-4 rounded-xl border border-white/5" placeholder="Ex: João" placeholderTextColor="#666" value={firstName} onChangeText={setFirstName} />
                </View>
                <View>
                    <Text className="text-textGray mb-2 font-bold">Sobrenome</Text>
                    <TextInput className="bg-surface text-white p-4 rounded-xl border border-white/5" placeholder="Ex: Silva" placeholderTextColor="#666" value={lastName} onChangeText={setLastName} />
                </View>
                <View>
                    <Text className="text-textGray mb-2 font-bold">Email</Text>
                    <TextInput className="bg-surface text-white p-4 rounded-xl border border-white/5" placeholder="email@exemplo.com" placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                </View>
                <View>
                    <Text className="text-textGray mb-2 font-bold">Telefone</Text>
                    <TextInput className="bg-surface text-white p-4 rounded-xl border border-white/5" placeholder="11999999999" placeholderTextColor="#666" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
                </View>
                <View>
                    <Text className="text-textGray mb-2 font-bold">
                        Senha {id && <Text className="font-normal text-xs text-primary">(Deixe em branco para manter)</Text>}
                    </Text>
                    <TextInput className="bg-surface text-white p-4 rounded-xl border border-white/5" placeholder="******" placeholderTextColor="#666" secureTextEntry value={senha} onChangeText={setSenha} />
                </View>
            </View>

            <TouchableOpacity onPress={handleSave} disabled={loading} className={`h-14 rounded-xl items-center justify-center mt-10 ${loading ? 'bg-gray-600' : 'bg-primary'}`}>
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Salvar {roleName}</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}