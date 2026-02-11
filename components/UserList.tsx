import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { userService, User } from '../services/userService';

interface UserListProps {
    roleId: number;
    title: string;
    baseRoute: string;
}

export default function UserList({ roleId, title, baseRoute }: UserListProps) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // <--- Estado para o Pull to Refresh
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    // Função de busca (aceita parâmetro para saber se é refresh ou load normal)
    const fetchUsers = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true); // Só mostra loading grande se não for refresh
        
        try {
            const data = await userService.getByType(roleId);
            setUsers(data);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: `Não foi possível carregar os ${title.toLowerCase()}.` });
        } finally {
            setLoading(false);
            setRefreshing(false); // Para o spinner do refresh
        }
    }, [roleId, title]);

    // 1. ATUALIZAÇÃO AUTOMÁTICA AO VOLTAR
    // Roda sempre que a tela ganha foco (entra na tela ou volta do formulário)
    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [fetchUsers])
    );

    // 2. AÇÃO DE PUXAR PARA BAIXO
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers(true); // Passa true para indicar que é um refresh
    }, [fetchUsers]);

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.delete(userToDelete);
            setUserToDelete(null);
            Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Usuário removido!' });
            fetchUsers();
        } catch (error) {
            setUserToDelete(null);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Erro ao excluir.' });
        }
    };

    const renderItem = ({ item }: { item: User }) => (
        <View className="bg-surface p-4 rounded-xl mb-3 border border-white/5">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
                        <Text className="text-primary font-bold text-lg">{item.nomeCompleto.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text className="text-white font-bold text-lg">{item.nomeCompleto}</Text>
                        <Text className="text-textGray text-xs">ID: {item.id}</Text>
                    </View>
                </View>

                <View className="flex-row gap-2">
                    <TouchableOpacity 
                        onPress={() => router.push({ pathname: `${baseRoute}/form` as any, params: { id: item.id } })}
                        className="p-2 bg-blue-500/20 rounded-lg"
                    >
                        <Ionicons name="pencil" size={18} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setUserToDelete(item.id)} className="p-2 bg-red-500/20 rounded-lg">
                        <Ionicons name="trash" size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="mt-2 pl-2 border-l-2 border-gray-700">
                <Text className="text-textGray text-sm">📧 {item.email}</Text>
                <Text className="text-textGray text-sm mt-1">📞 {item.telefone}</Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-background-dark p-4">
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#f31b58" className="mt-10" />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ListEmptyComponent={<Text className="text-textGray text-center mt-10">Nenhum registro encontrado.</Text>}
                    // PROPRIEDADES DO REFRESH CONTROL
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={onRefresh} 
                            tintColor="#f31b58" // Cor do spinner no iOS
                            colors={["#f31b58"]} // Cor do spinner no Android
                        />
                    }
                />
            )}

            <TouchableOpacity
                onPress={() => router.push(`${baseRoute}/form` as any)}
                className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/50"
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <Modal transparent visible={!!userToDelete} animationType="fade" onRequestClose={() => setUserToDelete(null)}>
                <View className="flex-1 bg-black/80 justify-center items-center p-6">
                    <View className="bg-surface w-full p-6 rounded-2xl border border-white/10">
                        <Text className="text-white text-xl font-bold text-center mb-2">Excluir Usuário?</Text>
                        <Text className="text-textGray text-center mb-6">Essa ação é irreversível.</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity onPress={() => setUserToDelete(null)} className="flex-1 h-12 bg-gray-700 rounded-xl justify-center items-center">
                                <Text className="text-white font-bold">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} className="flex-1 h-12 bg-red-500 rounded-xl justify-center items-center">
                                <Text className="text-white font-bold">Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}