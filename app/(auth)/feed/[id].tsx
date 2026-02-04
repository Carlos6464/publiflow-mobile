import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { postService, Post } from '../../../services/postService';

export default function PostDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            try {
                if (id) {
                    // Token vai automático aqui também
                    const data = await postService.getById(String(id));
                    setPost(data);
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 bg-background-dark justify-center items-center">
                <ActivityIndicator size="large" color="#f31b58" />
            </View>
        );
    }

    if (!post) {
        return (
            <View className="flex-1 bg-background-dark justify-center items-center">
                <Text className="text-white">Post não encontrado.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-primary font-bold">Voltar</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView className="flex-1 bg-background-dark">

            {/* Botão Voltar */}
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-12 left-6 z-50 w-10 h-10 bg-black/50 rounded-full items-center justify-center border border-white/20"
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Imagem de Capa */}
            {post.caminhoImagem ? (
                <Image
                    source={{ uri: post.caminhoImagem.startsWith('http') ? post.caminhoImagem : `http://192.168.1.68:3333/uploads/${post.caminhoImagem}` }}
                    className="w-full h-80 bg-gray-900"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-full h-80 bg-surface items-center justify-center border-b border-white/5">
                    <Ionicons name="image-outline" size={64} color="#555" />
                </View>
            )}

            {/* Conteúdo Arredondado subindo na imagem */}
            <View className="p-8 -mt-10 bg-background-dark rounded-t-[40px] min-h-screen shadow-2xl shadow-black">

                {/* Indicador visual */}
                <View className="w-12 h-1.5 bg-gray-700 rounded-full self-center mb-8 opacity-50" />

                <Text className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                    Postagem Acadêmica
                </Text>

                <Text className="text-3xl font-bold text-white mb-6 leading-tight">
                    {post.titulo}
                </Text>

                {/* Info do Autor */}
                <View className="flex-row items-center mb-8 bg-surface p-4 rounded-2xl border border-white/5 self-start">
                    <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
                        <Ionicons name="person" size={20} color="#f31b58" />
                    </View>
                    <View>
                        <Text className="text-textGray text-xs uppercase font-bold">Autor</Text>
                        <Text className="text-white font-bold text-sm">ID: {post.autorID}</Text>
                    </View>
                </View>

                <View className="h-[1px] bg-white/10 mb-8 w-full" />

                <Text className="text-gray-300 text-lg leading-8 font-light">
                    {post.descricao}
                </Text>

                <View className="h-24" />
            </View>
        </ScrollView>
    );
}