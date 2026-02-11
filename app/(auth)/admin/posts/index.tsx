import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router'; // <--- Importante: useFocusEffect
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { postService, Post } from '../../../../services/postService';

export default function PostsAdminList() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // <--- Estado para o Pull to Refresh

    // Estado para controlar o Modal de Exclusão
    const [postToDelete, setPostToDelete] = useState<number | null>(null);

    // Carregar posts (aceita parâmetro para saber se é refresh ou load normal)
    const fetchPosts = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true); // Só mostra o loading grande se não for refresh
        
        try {
            const data = await postService.getAllAdmin();
            setPosts(data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar os posts.'
            });
        } finally {
            setLoading(false);
            setRefreshing(false); // Para o spinner do refresh
        }
    }, []);

    // 1. ATUALIZAÇÃO AUTOMÁTICA AO VOLTAR
    // Roda sempre que a tela ganha foco (entra na tela ou volta do formulário)
    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [fetchPosts])
    );

    // 2. AÇÃO DE PUXAR PARA BAIXO
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts(true); // Passa true para indicar que é um refresh
    }, [fetchPosts]);

    // Abre o modal perguntando qual ID deletar
    const confirmDelete = (id: number) => {
        setPostToDelete(id);
    };

    // Executa a exclusão de fato
    const handleDelete = async () => {
        if (!postToDelete) return;

        try {
            await postService.delete(postToDelete);
            
            // Fecha o modal
            setPostToDelete(null);

            // Feedback elegante
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Postagem removida com sucesso!'
            });

            // Atualiza a lista
            fetchPosts(); 
        } catch (error) {
            setPostToDelete(null);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Falha ao excluir a postagem.'
            });
        }
    };

    const renderItem = ({ item }: { item: Post }) => (
        <View className="bg-surface p-4 rounded-xl mb-3 flex-row items-center justify-between border border-white/5">
            <View className="flex-1 mr-4">
                <Text className="text-white font-bold text-lg" numberOfLines={1}>{item.titulo}</Text>
                <Text className="text-textGray text-sm" numberOfLines={1}>{item.descricao}</Text>
                <View className="flex-row mt-2">
                    <View className={`px-2 py-0.5 rounded-md ${item.visibilidade ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                         <Text className={`text-xs ${item.visibilidade ? 'text-green-400' : 'text-red-400'}`}>
                            {item.visibilidade ? 'Visível' : 'Oculto'}
                         </Text>
                    </View>
                </View>
            </View>

            <View className="flex-row gap-2">
                {/* Botão Editar */}
                <TouchableOpacity 
                    onPress={() => router.push({ pathname: '/(auth)/admin/posts/form', params: { id: item.id } })}
                    className="p-2 bg-blue-500/20 rounded-lg"
                >
                    <Ionicons name="pencil" size={20} color="#3b82f6" />
                </TouchableOpacity>

                {/* Botão Excluir (Abre Modal) */}
                <TouchableOpacity 
                    onPress={() => confirmDelete(item.id)}
                    className="p-2 bg-red-500/20 rounded-lg"
                >
                    <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-background-dark p-4">
            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#f31b58" className="mt-10" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ListEmptyComponent={
                        <Text className="text-textGray text-center mt-10">Nenhuma postagem cadastrada.</Text>
                    }
                    // PROPRIEDADES DO REFRESH CONTROL
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={onRefresh} 
                            tintColor="#f31b58" // iOS
                            colors={["#f31b58"]} // Android
                        />
                    }
                />
            )}

            {/* Botão Flutuante (FAB) para Criar */}
            <TouchableOpacity
                onPress={() => router.push('/(auth)/admin/posts/form')}
                className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/50"
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            {/* --- MODAL CUSTOMIZADO DE EXCLUSÃO --- */}
            <Modal
                transparent
                visible={!!postToDelete}
                animationType="fade"
                onRequestClose={() => setPostToDelete(null)}
            >
                {/* Overlay Escuro */}
                <View className="flex-1 bg-black/80 justify-center items-center p-6">
                    
                    {/* Conteúdo do Modal */}
                    <View className="bg-surface w-full p-6 rounded-2xl border border-white/10 shadow-2xl">
                        <View className="items-center mb-4">
                            <View className="w-12 h-12 bg-red-500/10 rounded-full items-center justify-center mb-4">
                                <Ionicons name="trash-outline" size={24} color="#ef4444" />
                            </View>
                            <Text className="text-white text-xl font-bold text-center">Excluir Postagem?</Text>
                            <Text className="text-textGray text-center mt-2">
                                Tem certeza que deseja remover este item? Esta ação não pode ser desfeita.
                            </Text>
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity 
                                onPress={() => setPostToDelete(null)}
                                className="flex-1 h-12 bg-gray-700 rounded-xl justify-center items-center"
                            >
                                <Text className="text-white font-bold">Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={handleDelete}
                                className="flex-1 h-12 bg-red-500 rounded-xl justify-center items-center"
                            >
                                <Text className="text-white font-bold">Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}