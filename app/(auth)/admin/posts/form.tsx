import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Switch, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message'; // <--- IMPORT ADICIONADO

import { postService } from '../../../../services/postService';
import { useAuth } from '../../../../contexts/AuthContext';

export default function PostForm() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user } = useAuth();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [visibilidade, setVisibilidade] = useState(true);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.68:3333';

    useEffect(() => {
        if (id) {
            setLoading(true);
            postService.getById(String(id))
                .then((post) => {
                    setTitulo(post.titulo);
                    setDescricao(post.descricao);
                    setVisibilidade(post.visibilidade);
                    if (post.caminhoImagem) {
                        const fullUrl = post.caminhoImagem.startsWith('http') 
                            ? post.caminhoImagem 
                            : `${apiUrl}/uploads/${post.caminhoImagem}`;
                        setImageUri(fullUrl);
                    }
                })
                .catch(() => {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: 'Post não encontrado.'
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!titulo || !descricao) {
            return Toast.show({
                type: 'info',
                text1: 'Atenção',
                text2: 'Preencha título e descrição para continuar.'
            });
        }

        if (!id && (!imageUri || imageUri.startsWith('http'))) {
            return Toast.show({
                type: 'info',
                text1: 'Imagem Obrigatória',
                text2: 'Selecione uma imagem para criar o post.'
            });
        }

        if (!user) {
            return Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Usuário não autenticado.'
            });
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('descricao', descricao);
            formData.append('visibilidade', String(visibilidade));

           if (imageUri && !imageUri.startsWith('http')) {
                let filename = imageUri.split('/').pop() || `foto.${Date.now()}.jpg`;

                if (!/\.\w+$/.test(filename)) {
                    filename += '.jpg';
                }

                const match = /\.(\w+)$/.exec(filename);
                const fileType = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('imagem', {
                    uri: imageUri,
                    name: filename,
                    type: fileType,
                } as any);
            }

            if (id) {
                await postService.update(Number(id), formData);
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: 'Postagem atualizada!'
                });
            } else {
                await postService.create(formData);
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: 'Postagem criada!'
                });
            }

            router.back();

        } catch (error: any) {
            console.error('[handleSave RN] Erro:', error);
            const msg = error.response?.data?.message || "Falha ao salvar postagem.";
            
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: msg
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-background-dark p-6">
            <Text className="text-2xl font-bold text-white mb-6">
                {id ? 'Editar Postagem' : 'Nova Postagem'}
            </Text>

            <TouchableOpacity onPress={pickImage} className="w-full h-48 bg-surface rounded-xl items-center justify-center mb-6 border border-dashed border-gray-600 overflow-hidden">
                {imageUri ? (
                    <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <View className="items-center">
                        <Ionicons name="camera-outline" size={40} color="#8C8C8C" />
                        <Text className="text-textGray mt-2">Toque para adicionar imagem</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View className="mb-4">
                <Text className="text-textGray mb-2 font-bold">Título</Text>
                <TextInput
                    className="bg-surface text-white p-4 rounded-xl border border-white/5"
                    placeholder="Ex: Evento de Tecnologia"
                    placeholderTextColor="#666"
                    value={titulo}
                    onChangeText={setTitulo}
                />
            </View>

            <View className="mb-6">
                <Text className="text-textGray mb-2 font-bold">Descrição</Text>
                <TextInput
                    className="bg-surface text-white p-4 rounded-xl border border-white/5 h-32"
                    placeholder="Detalhes da postagem..."
                    placeholderTextColor="#666"
                    multiline
                    textAlignVertical="top"
                    value={descricao}
                    onChangeText={setDescricao}
                />
            </View>

            <View className="flex-row items-center justify-between bg-surface p-4 rounded-xl mb-8 border border-white/5">
                <Text className="text-white font-bold">Visível no Feed?</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#f31b58" }}
                    thumbColor={visibilidade ? "#fff" : "#f4f3f4"}
                    onValueChange={setVisibilidade}
                    value={visibilidade}
                />
            </View>

            <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                className={`h-14 rounded-xl items-center justify-center mb-10 ${loading ? 'bg-gray-600' : 'bg-primary'}`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Salvar Postagem</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}