import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

const API_URL = 'http://172.20.10.3:5001';

export default function FavorisPage() {
    const { token } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch(`${API_URL}/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) setFavorites(await res.json());
            } catch { }
            setLoading(false);
        };
        if (token) fetchFavorites();
        else setLoading(false);
    }, [token]);

    const deleteFavorite = async (id: number) => {
        try {
            await fetch(`${API_URL}/favorites/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(prev => prev.filter(f => f.id !== id));
        } catch { }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <PageHeader title="Mes favoris" />
            <PageTransition>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-4 pt-5 pb-8">
                        <Text className="text-2xl font-bold text-gray-900 mb-1">Mes favoris</Text>
                        <Text className="text-sm text-gray-500 mb-5">Les faits qui vous ont inspiré</Text>

                        {loading ? (
                            <ActivityIndicator color="#7c3aed" size="large" className="mt-10" />
                        ) : favorites.length === 0 ? (
                            <View className="bg-[#f5f0ff] rounded-xl p-6 items-center" style={{ borderLeftWidth: 4, borderLeftColor: '#7c3aed' }}>
                                <Text className="text-3xl mb-2">🔖</Text>
                                <Text className="text-gray-700 font-medium text-center">Aucun favori pour l'instant.</Text>
                                <Text className="text-gray-500 text-sm text-center mt-1">Sauvegardez des faits depuis l'onglet Faits.</Text>
                            </View>
                        ) : (
                            favorites.map((fav, i) => (
                                <View
                                    key={i}
                                    className="bg-white border border-gray-100 rounded-xl mb-3 p-4"
                                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 }}
                                >
                                    <View className="flex-row items-start justify-between" style={{ gap: 10 }}>
                                        <View className="flex-1">
                                            <Text className="text-sm text-gray-800 leading-5 mb-2">{fav.fact_text}</Text>
                                            <View className="bg-[#f5f0ff] self-start px-3 py-1 rounded-full">
                                                <Text className="text-xs text-[#7c3aed] font-medium">{fav.fact_type}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => deleteFavorite(fav.id)} activeOpacity={0.7}>
                                            <Text className="text-red-400 text-lg">×</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
