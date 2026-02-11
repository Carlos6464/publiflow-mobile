import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { postService, Post } from '../../../services/postService';

export default function Feed() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Variável de ambiente
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.68:3333';

    // Função principal de busca
    async function fetchPosts(pageNumber: number, shouldRefresh = false, query = '') {
        // Se for paginação (scroll infinito) e já estiver carregando, bloqueia.
        // Se for refresh ou busca nova, PERMITE passar (para cancelar o visual anterior)
        if (loading && !shouldRefresh) return;
        
        setLoading(true);

        try {
            const { posts: newPosts, meta } = await postService.getAll({
                page: pageNumber,
                limit: 6,
                q: query // Usa a query passada por parâmetro para garantir o valor atual
            });

            if (shouldRefresh) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }

            // Verifica se tem mais páginas baseado no meta
            if (meta.currentPage >= meta.totalPages) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (error) {
            console.error("Erro ao buscar posts:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    // 1. EFEITO DE BUSCA COM DEBOUNCE (Espera o usuário parar de digitar)
    useEffect(() => {
        // Cria um timer de 600ms
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            setHasMore(true);
            // Chama a busca passando o texto atual
            fetchPosts(1, true, searchText); 
        }, 600);

        // Limpa o timer se o usuário digitar de novo antes dos 600ms
        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    // 2. REFRESH (Arrastar pra baixo)
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true, searchText);
    }, [searchText]);

    // 3. LOAD MORE (Scroll Infinito)
    const loadMore = () => {
        // Aqui mantemos a proteção estrita: só carrega se não estiver carregando e tiver mais itens
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage, false, searchText);
        }
    };

    const renderItem = ({ item }: { item: Post }) => (
        <TouchableOpacity
            onPress={() => router.push(`/(auth)/feed/${item.id}`)}
            className="bg-surface rounded-2xl mb-6 overflow-hidden shadow-lg shadow-black/30 border border-white/5 active:opacity-90"
        >
            {item.caminhoImagem ? (
                <Image
                    source={{
                        uri: item.caminhoImagem.startsWith('http')
                            ? item.caminhoImagem
                            : `${apiUrl}/uploads/${item.caminhoImagem}`
                    }}
                    className="w-full h-48 bg-gray-800"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-full h-32 bg-gray-800 items-center justify-center">
                    <Ionicons name="image-outline" size={40} color="#8C8C8C" />
                </View>
            )}

            <View className="p-4">
                <Text className="text-white text-lg font-bold mb-2">{item.titulo}</Text>
                <Text className="text-textGray text-sm" numberOfLines={2}>
                    {item.descricao}
                </Text>

                <View className="mt-4 flex-row justify-between items-center">
                    <Text className="text-primary text-xs font-bold">Ler mais</Text>
                    <Text className="text-textGray text-xs">Autor: {item.autorID}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-background-dark">
            <View className="pt-14 pb-6 px-6 flex-row justify-between items-center bg-surface border-b-2 border-primary rounded-b-3xl z-10 shadow-lg shadow-black">
                <View>
                    <Text className="text-textGray text-xs uppercase font-bold tracking-widest">Bem-vindo,</Text>
                    <Text className="text-white text-2xl font-bold">{user?.nomeCompleto}</Text>
                </View>
                <TouchableOpacity onPress={signOut} className="p-3 bg-background-dark rounded-full border border-gray-800 active:bg-primary/20">
                    <Ionicons name="log-out-outline" size={24} color="#f31b58" />
                </TouchableOpacity>
            </View>

            <View className="px-6 mt-6 mb-2">
                <View className="flex-row items-center bg-surface h-12 rounded-xl px-4 border border-gray-700">
                    <Ionicons name="search" size={20} color="#8C8C8C" />
                    <TextInput
                        className="flex-1 ml-3 text-white"
                        placeholder="Pesquisar postagens..."
                        placeholderTextColor="#8C8C8C"
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                    />
                    {/* Botão para limpar busca */}
                    {searchText.length > 0 && (
                         <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#8C8C8C" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f31b58" />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                    // Mostra loading apenas se estiver carregando E NÃO for um refresh (puxar pra baixo)
                    loading && !refreshing ? <ActivityIndicator size="small" color="#f31b58" className="mt-4" /> : null
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center justify-center mt-10 opacity-50">
                            <Ionicons name="document-text-outline" size={60} color="#8C8C8C" />
                            <Text className="text-textGray mt-4">Nenhuma postagem encontrada.</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}