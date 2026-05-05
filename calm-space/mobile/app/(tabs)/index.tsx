import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

const quickActions = [
    { icon: 'bulb-outline', title: 'Faits du jour', path: '/(tabs)/faits', color: '#f59e0b' },
    { icon: 'cloud-outline', title: 'Respiration', path: '/(tabs)/respiration', color: '#3b82f6' },
    { icon: 'heart-outline', title: 'Mes émotions', path: '/(tabs)/emotions', color: '#ec4899' },
    { icon: 'clipboard-outline', title: 'Diagnostic', path: '/pages/diagnostic', color: '#10b981' },
] as const;

const tips = [
    { icon: 'sunny-outline', text: 'Prenez 5 min pour respirer profondément' },
    { icon: 'walk-outline', text: 'Une courte marche peut changer votre humeur' },
    { icon: 'water-outline', text: 'Hydratez-vous régulièrement' },
];

export default function HomeTab() {
    const { decoded } = useAuth();
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#f5f0ff]" edges={[]}>
            <Header />
            <PageTransition>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, gap: 14 }}
                >
                    {/* Carte de bienvenue */}
                    <View
                        className="bg-[#7c3aed] rounded-xl p-5"
                        style={{ shadowColor: '#7c3aed', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                    >
                        <Text className="text-white text-xl font-bold mb-1">
                            {decoded ? `Bonjour, ${decoded.firstname} 🌿` : 'Bienvenue sur CalmSpace 🌿'}
                        </Text>
                        <Text className="text-purple-200 text-sm mb-4">
                            Votre espace de sérénité et de bien-être mental.
                        </Text>
                        {!decoded && (
                            <View style={{ gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => router.push('/pages/inscription')}
                                    className="bg-white rounded-lg px-5 py-3 items-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-[#7c3aed] font-bold">Créer un compte</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => router.push('/pages/connexion')}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-center text-white text-sm">
                                        Déjà un compte ? <Text className="font-bold">Se connecter</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Ligne d'urgence */}
                    <View className="bg-white rounded-xl p-4 flex-row items-center" style={{ gap: 12, borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
                        <View className="bg-red-100 rounded-lg p-2.5">
                            <Ionicons name="call-outline" size={20} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-sm">3114 — Numéro national</Text>
                            <Text className="text-gray-500 text-xs mt-0.5">Prévention du suicide · 24h/24</Text>
                        </View>
                    </View>

                    {/* Accès rapide */}
                    <Text className="text-base font-bold text-gray-900">Accès rapide</Text>
                    <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                        {quickActions.map((a, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => router.push(a.path as any)}
                                className="bg-white rounded-xl items-center justify-center p-4"
                                style={{ width: '47%', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
                                activeOpacity={0.85}
                            >
                                <View className="rounded-xl p-3 mb-2" style={{ backgroundColor: a.color + '20' }}>
                                    <Ionicons name={a.icon} size={26} color={a.color} />
                                </View>
                                <Text className="text-sm font-medium text-gray-900 text-center">{a.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Conseils du jour */}
                    <View className="bg-white rounded-xl p-5" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                        <Text className="text-sm font-bold text-gray-900 mb-3 pb-2" style={{ borderBottomWidth: 2, borderBottomColor: '#7c3aed' }}>
                            Conseils bien-être
                        </Text>
                        <View style={{ gap: 10 }}>
                            {tips.map((t, i) => (
                                <View key={i} className="flex-row items-center" style={{ gap: 10 }}>
                                    <View className="bg-[#f5f0ff] rounded-lg p-2">
                                        <Ionicons name={t.icon as any} size={16} color="#7c3aed" />
                                    </View>
                                    <Text className="text-sm text-gray-700 flex-1">{t.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Diagnostic stress */}
                    <TouchableOpacity
                        onPress={() => router.push('/pages/diagnostic')}
                        className="bg-[#f5f0ff] rounded-xl p-4"
                        style={{ borderLeftWidth: 4, borderLeftColor: '#7c3aed' }}
                        activeOpacity={0.8}
                    >
                        <Text className="text-sm font-bold text-gray-900 mb-1">
                            Évaluer mon niveau de stress
                        </Text>
                        <Text className="text-xs text-gray-700 mb-2">
                            Passez le diagnostic de Holmes & Rahe pour mieux comprendre votre situation.
                        </Text>
                        <Text className="text-xs text-[#7c3aed] font-bold">Commencer →</Text>
                    </TouchableOpacity>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
