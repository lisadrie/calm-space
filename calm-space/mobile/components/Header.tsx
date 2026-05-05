import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            className="bg-white px-4 pb-3"
            style={{
                paddingTop: insets.top + 8,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb',
            }}
        >
            <TouchableOpacity
                onPress={() => router.push('/')}
                className="flex-row items-center"
                activeOpacity={0.8}
            >
                <Image
                    source={require('../assets/logo.png')}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                    resizeMode="contain"
                />
                <View className="ml-3 flex-1">
                    <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>
                        CalmSpace
                    </Text>
                    <Text className="text-xs text-gray-500" numberOfLines={1}>
                        Votre espace bien-être mental
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default Header;
