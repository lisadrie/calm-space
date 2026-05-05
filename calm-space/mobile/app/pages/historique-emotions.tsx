import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

const API_URL = 'http://172.20.10.3:5001';

export default function HistoriqueEmotionsPage() {
    const { token } = useAuth();
    const [emotions, setEmotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                const res = await fetch(`${API_URL}/emotions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setEmotions(data);
                }
            } catch { }
            setLoading(false);
        };
        if (token) fetchEmotions();
        else setLoading(false);
    }, [token]);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <PageHeader title="Mes émotions" />
            <PageTransition>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-4 pt-5 pb-8">
                        <Text className="text-2xl font-bold text-gray-900 mb-1">Historique des émotions</Text>
                        <Text className="text-sm text-gray-500 mb-5">Votre journal émotionnel</Text>

                        {loading ? (
                            <ActivityIndicator color="#7c3aed" size="large" className="mt-10" />
                        ) : emotions.length === 0 ? (
                            <View className="bg-[#f5f0ff] rounded-xl p-6 items-center" style={{ borderLeftWidth: 4, borderLeftColor: '#7c3aed' }}>
                                <Text className="text-3xl mb-2">💜</Text>
                                <Text className="text-gray-700 font-medium text-center">Aucune émotion enregistrée pour l'instant.</Text>
                                <Text className="text-gray-500 text-sm text-center mt-1">Commencez par enregistrer votre humeur du jour.</Text>
                            </View>
                        ) : (
                            emotions.map((em, i) => (
                                <View
                                    key={i}
                                    className="bg-white border border-gray-100 rounded-xl mb-3 p-4 flex-row items-center"
                                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 }}
                                >
                                    <Text className="text-3xl mr-3">{em.emoji}</Text>
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-gray-900">{em.emotion}</Text>
                                        <Text className="text-xs text-gray-400 mt-0.5">{formatDate(em.logged_at)}</Text>
                                    </View>
                                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: em.color || '#7c3aed' }} />
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
