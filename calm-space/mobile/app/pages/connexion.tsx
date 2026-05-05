import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

export default function ConnexionPage() {
    const { message, error, Signin } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <PageHeader title="Connexion" />
            <PageTransition>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-4 pt-5 pb-8">
                        <Text className="text-2xl font-bold text-gray-900 mb-2">Se connecter</Text>
                        <Text className="text-sm text-gray-600 mb-5">Accédez à votre espace CalmSpace</Text>

                        <View className="bg-[#f5f0ff] rounded-xl mb-5 p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#7c3aed' }}>
                            <Text className="font-bold text-gray-900 mb-1 text-sm">Connexion sécurisée 🔒</Text>
                            <Text className="text-xs text-gray-700">Vos données sont protégées conformément au RGPD.</Text>
                        </View>

                        {message ? (
                            <View className="mb-4 bg-green-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
                                <Text className="font-bold text-green-700 mb-1 text-sm">Succès</Text>
                                <Text className="text-green-700 text-xs">{message}</Text>
                            </View>
                        ) : null}
                        {error ? (
                            <View className="mb-4 bg-red-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
                                <Text className="font-bold text-red-600 mb-1 text-sm">Erreur</Text>
                                <Text className="text-red-600 text-xs">{error}</Text>
                            </View>
                        ) : null}

                        <Text className="text-sm font-medium text-gray-700 mb-1">Adresse email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
                            placeholder="nom@domaine.fr"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text className="text-sm font-medium text-gray-700 mb-1">Mot de passe</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
                            placeholder="Votre mot de passe"
                            secureTextEntry
                        />

                        <TouchableOpacity
                            onPress={() => Signin(email, password)}
                            className="bg-[#7c3aed] rounded-lg px-5 py-3 items-center mb-4"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold">Se connecter</Text>
                        </TouchableOpacity>

                        <Text
                            className="text-center text-[#7c3aed] text-sm mt-2"
                            onPress={() => router.push('/pages/inscription')}
                        >
                            Pas encore de compte ? <Text className="font-bold">Créer un compte</Text>
                        </Text>
                    </View>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
