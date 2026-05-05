import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

// ⚠️ Défini EN DEHORS du composant pour éviter le bug clavier
const Field = ({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) => (
    <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
            {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
        {children}
    </View>
);

export default function InscriptionPage() {
    const { message, error, Signup } = useAuth();
    const router = useRouter();
    const [civility, setCivility] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cgu, setCgu] = useState(false);
    const [rgpd, setRgpd] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <PageHeader title="Créer un compte" />
            <PageTransition>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-4 pt-5 pb-8">
                        <Text className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</Text>
                        <Text className="text-sm text-gray-600 mb-5">Rejoignez CalmSpace gratuitement</Text>

                        {message ? (
                            <View className="mb-4 bg-green-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
                                <Text className="font-bold text-green-700 text-sm">{message}</Text>
                            </View>
                        ) : null}
                        {error ? (
                            <View className="mb-4 bg-red-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
                                <Text className="font-bold text-red-600 text-sm">{error}</Text>
                            </View>
                        ) : null}

                        <Text className="text-base font-bold text-gray-900 mb-3">Civilité <Text className="text-red-500">*</Text></Text>
                        <View className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
                            {['Madame', 'Monsieur', 'Autre'].map((opt, i) => (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => setCivility(opt)}
                                    className={`px-4 py-3 flex-row items-center ${civility === opt ? 'bg-[#f5f0ff]' : 'bg-white'}`}
                                    style={{ borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: '#e5e7eb' }}
                                    activeOpacity={0.7}
                                >
                                    <View className="w-4 h-4 rounded-full border-2 mr-3" style={{ borderColor: civility === opt ? '#7c3aed' : '#9ca3af', backgroundColor: civility === opt ? '#7c3aed' : 'transparent' }} />
                                    <Text className={`text-sm ${civility === opt ? 'text-[#7c3aed] font-medium' : 'text-gray-700'}`}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Field label="Prénom" required>
                            <TextInput value={firstname} onChangeText={setFirstname} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="Votre prénom" autoCapitalize="words" />
                        </Field>
                        <Field label="Nom" required>
                            <TextInput value={lastname} onChangeText={setLastname} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="Votre nom" autoCapitalize="words" />
                        </Field>
                        <Field label="Email" required>
                            <TextInput value={email} onChangeText={setEmail} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="nom@domaine.fr" keyboardType="email-address" autoCapitalize="none" />
                        </Field>
                        <Field label="Téléphone">
                            <TextInput value={phone} onChangeText={setPhone} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="0612345678" keyboardType="phone-pad" />
                        </Field>
                        <Field label="Date de naissance (YYYY-MM-DD)" required>
                            <TextInput value={birthdate} onChangeText={setBirthdate} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="1990-01-01" />
                        </Field>
                        <Field label="Ville" required>
                            <TextInput value={city} onChangeText={setCity} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="Votre ville" autoCapitalize="words" />
                        </Field>
                        <Field label="Code postal" required>
                            <TextInput value={postcode} onChangeText={setPostcode} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="75001" keyboardType="number-pad" maxLength={5} />
                        </Field>
                        <Field label="Pseudo" required>
                            <TextInput value={pseudo} onChangeText={setPseudo} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="VotreAlias" autoCapitalize="none" />
                        </Field>
                        <Field label="Mot de passe" required>
                            <TextInput value={password} onChangeText={setPassword} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="6+ caractères" secureTextEntry />
                        </Field>
                        <Field label="Confirmer le mot de passe" required>
                            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900" placeholder="Confirmer" secureTextEntry />
                        </Field>

                        {/* Consentements */}
                        {[
                            { val: cgu, set: setCgu, label: "J'accepte les conditions générales d'utilisation" },
                            { val: rgpd, set: setRgpd, label: "J'accepte la politique de protection des données (RGPD)" },
                        ].map((c, i) => (
                            <TouchableOpacity key={i} onPress={() => c.set(!c.val)} className="flex-row items-start mb-4" activeOpacity={0.7}>
                                <View className="w-5 h-5 border-2 rounded mr-3 mt-0.5 items-center justify-center" style={{ borderColor: c.val ? '#7c3aed' : '#9ca3af', backgroundColor: c.val ? '#7c3aed' : 'transparent' }}>
                                    {c.val && <Text className="text-white text-xs font-bold">✓</Text>}
                                </View>
                                <Text className="text-sm text-gray-700 flex-1"><Text className="text-red-500">* </Text>{c.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={() => cgu && rgpd && Signup(civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password, confirmPassword)}
                            className={`rounded-lg px-5 py-3 items-center mt-2 mb-4 ${cgu && rgpd ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold">Créer mon compte</Text>
                        </TouchableOpacity>

                        <Text className="text-center text-sm text-gray-700">
                            Déjà un compte ?{' '}
                            <Text className="text-[#7c3aed] font-bold" onPress={() => router.push('/pages/connexion')}>Se connecter</Text>
                        </Text>
                    </View>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
