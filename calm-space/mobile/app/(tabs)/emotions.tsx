import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Header from '../../components/Header';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { API_URL } from '../../config';

const EMOTIONS = [
    { emoji: '😊', label: 'Joyeux', color: '#fbbf24' },
    { emoji: '😔', label: 'Triste', color: '#60a5fa' },
    { emoji: '😰', label: 'Anxieux', color: '#a78bfa' },
    { emoji: '😤', label: 'En colère', color: '#f87171' },
    { emoji: '😴', label: 'Fatigué', color: '#94a3b8' },
    { emoji: '😌', label: 'Serein', color: '#34d399' },
    { emoji: '🤩', label: 'Enthousiaste', color: '#fb923c' },
    { emoji: '😕', label: 'Perdu', color: '#c084fc' },
];

export default function EmotionsTab() {
    const { decoded, token } = useAuth();
    const router = useRouter();
    const [selectedEmotion, setSelectedEmotion] = useState<typeof EMOTIONS[0] | null>(null);
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    if (!decoded) {
        return (
            <SafeAreaView className="flex-1 bg-[#f5f0ff]" edges={[]}>
                <Header />
                <PageTransition>
                    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 14 }}>
                        <View className="bg-[#7c3aed] rounded-xl p-5">
                            <Text className="text-white font-bold text-base mb-2">Journal des émotions 💜</Text>
                            <Text className="text-purple-200 text-sm">
                                Suivez votre humeur au quotidien pour mieux comprendre vos émotions.
                            </Text>
                        </View>
                        <View className="bg-white rounded-xl p-5" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            <Text className="text-base font-bold text-gray-900 mb-2">Connectez-vous pour continuer</Text>
                            <Text className="text-sm text-gray-600 mb-4">
                                Le journal des émotions nécessite un compte pour sauvegarder votre historique.
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/pages/connexion')} className="bg-[#7c3aed] rounded-lg py-3 items-center mb-2" activeOpacity={0.8}>
                                <Text className="text-white font-bold">Se connecter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/pages/inscription')} className="bg-white border border-[#7c3aed] rounded-lg py-3 items-center" activeOpacity={0.8}>
                                <Text className="text-[#7c3aed] font-bold">Créer un compte</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </PageTransition>
            </SafeAreaView>
        );
    }

    const handleSave = async () => {
        if (!selectedEmotion) return;
        setError('');
        try {
            const res = await fetch(`${API_URL}/emotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ emotion: selectedEmotion.label, emoji: selectedEmotion.emoji, color: selectedEmotion.color }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => { setSaved(false); setSelectedEmotion(null); setNote(''); }, 2000);
            } else {
                setError('Erreur lors de la sauvegarde.');
            }
        } catch {
            setError('Impossible de contacter le serveur.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f0ff]" edges={[]}>
            <Header />
            <PageTransition>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
                    <Text className="text-2xl font-bold text-gray-900">Comment vous sentez-vous ?</Text>
                    <Text className="text-sm text-gray-500">Bonjour {decoded.firstname}, enregistrez votre humeur du moment</Text>

                    {saved && (
                        <View className="bg-green-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
                            <Text className="text-green-700 font-bold">✓ Émotion enregistrée !</Text>
                        </View>
                    )}
                    {error ? (
                        <View className="bg-red-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
                            <Text className="text-red-600 text-sm">{error}</Text>
                        </View>
                    ) : null}

                    {/* Grille émotions */}
                    <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                        {EMOTIONS.map((em, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setSelectedEmotion(em)}
                                className={`rounded-xl items-center justify-center py-4 ${selectedEmotion?.label === em.label ? 'border-2' : 'bg-white border border-gray-100'}`}
                                style={{
                                    width: '47%',
                                    borderColor: selectedEmotion?.label === em.label ? em.color : undefined,
                                    backgroundColor: selectedEmotion?.label === em.label ? em.color + '15' : 'white',
                                    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
                                }}
                                activeOpacity={0.8}
                            >
                                <Text className="text-3xl mb-1">{em.emoji}</Text>
                                <Text className="text-sm font-medium text-gray-800">{em.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Note optionnelle */}
                    {selectedEmotion && (
                        <View className="bg-white rounded-xl p-4" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            <Text className="text-sm font-bold text-gray-900 mb-2">
                                {selectedEmotion.emoji} {selectedEmotion.label} — Note (optionnel)
                            </Text>
                            <TextInput
                                value={note}
                                onChangeText={setNote}
                                placeholder="Qu'est-ce qui vous a amené à ce ressenti ?"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm"
                                style={{ minHeight: 80 }}
                            />
                            <TouchableOpacity
                                onPress={handleSave}
                                className="bg-[#7c3aed] rounded-lg py-3 items-center mt-3"
                                activeOpacity={0.85}
                            >
                                <Text className="text-white font-bold">Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Lien vers historique */}
                    <TouchableOpacity
                        onPress={() => router.push('/pages/historique-emotions')}
                        className="bg-white rounded-xl p-4 flex-row items-center justify-between"
                        style={{ borderLeftWidth: 3, borderLeftColor: '#7c3aed' }}
                        activeOpacity={0.8}
                    >
                        <Text className="text-sm font-bold text-gray-900">Voir mon historique</Text>
                        <Text className="text-[#7c3aed] font-bold">→</Text>
                    </TouchableOpacity>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
