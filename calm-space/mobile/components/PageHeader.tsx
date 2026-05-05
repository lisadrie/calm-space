import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageHeaderProps {
    title: string;
    onBack?: () => void;
}

const PageHeader = ({ title, onBack }: PageHeaderProps) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            className="bg-white flex-row items-center px-2 pb-3"
            style={{
                paddingTop: insets.top + 8,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb',
            }}
        >
            <TouchableOpacity
                onPress={onBack ?? (() => router.back())}
                activeOpacity={0.7}
                className="flex-row items-center flex-1"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <View style={{ padding: 6 }}>
                    <Ionicons name="chevron-back" size={24} color="#7c3aed" />
                </View>
                <Text className="text-base font-bold text-gray-900 flex-1 ml-1" numberOfLines={1}>
                    {title}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PageHeader;
