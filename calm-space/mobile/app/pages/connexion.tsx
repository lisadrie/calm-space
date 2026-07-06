import { ActivityIndicator, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

export default function ConnexionPage() {
    const { message, error, Signin, clearMessages } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (message === 'Connexion réussie !') {
            router.replace('/(tabs)');
        }
    }, [message]);

    const handleSubmit = async () => {
        if (submitting) return;
        Keyboard.dismiss();
        clearMessages();
        setSubmitting(true);
        await Signin(email, password);
        setSubmitting(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <PageHeader title="Connexion" />
            <PageTransition>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ flex: 1 }}>
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            <View className="px-4 pt-5 pb-8">
                                <Text className="text-2xl font-bold text-gray-900 mb-2">Se connecter</Text>
                                <Text className="text-sm text-gray-600 mb-5">Accédez à votre espace CalmSpace</Text>

                                <View className="bg-[#f5f0ff] rounded-xl mb-5 p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#7c3aed' }}>
                                    <Text className="font-bold text-gray-900 mb-1 text-sm">Connexion sécurisée</Text>
                                    <Text className="text-xs text-gray-700">Vos données sont protégées conformément au RGPD.</Text>
                                </View>

                                <Text className="text-sm font-medium text-gray-700 mb-1">Adresse email</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
                                    placeholder="nom@domaine.fr"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!submitting}
                                />

                                <Text className="text-sm font-medium text-gray-700 mb-1">Mot de passe</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
                                    placeholder="Votre mot de passe"
                                    secureTextEntry
                                    editable={!submitting}
                                    onSubmitEditing={handleSubmit}
                                    returnKeyType="done"
                                />

                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={submitting}
                                    className="rounded-lg px-5 py-3 items-center"
                                    style={{ backgroundColor: submitting ? '#a78bfa' : '#7c3aed' }}
                                    activeOpacity={0.8}
                                >
                                    {submitting ? (
                                        <View className="flex-row items-center gap-2">
                                            <ActivityIndicator size="small" color="#fff" />
                                            <Text className="text-white font-bold ml-2">Connexion…</Text>
                                        </View>
                                    ) : (
                                        <Text className="text-white font-bold">Se connecter</Text>
                                    )}
                                </TouchableOpacity>

                                {/* Erreurs et succès sous le bouton */}
                                {error ? (
                                    <View className="mt-3 bg-red-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
                                        <Text className="font-bold text-red-600 text-sm">{error}</Text>
                                    </View>
                                ) : null}
                                {message && message !== 'Connexion réussie !' ? (
                                    <View className="mt-3 bg-green-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
                                        <Text className="font-bold text-green-700 text-sm">{message}</Text>
                                    </View>
                                ) : null}

                                <Text
                                    className="text-center text-[#7c3aed] text-sm mt-5"
                                    onPress={() => router.push('/pages/inscription')}
                                >
                                    Pas encore de compte ?{' '}
                                    <Text className="font-bold">Créer un compte</Text>
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </PageTransition>
        </SafeAreaView>
    );
}
