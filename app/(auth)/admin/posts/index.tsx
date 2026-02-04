import { View, Text } from 'react-native';

export default function PostsList() {
    return (
        <View className="flex-1 justify-center items-center bg-background-light">
            <Text className="text-xl font-bold text-surface">Gerenciar Postagens</Text>
            <Text className="text-textGray mt-2">Lista em breve...</Text>
        </View>
    );
}