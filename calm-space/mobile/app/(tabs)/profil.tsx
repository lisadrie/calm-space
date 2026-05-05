import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function ProfilTab() {
    const { decoded, logout, updateProfile } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        civility: decoded?.civility || '',
        lastname: decoded?.lastname || '',
        firstname: decoded?.firstname || '',
        email: decoded?.email || '',
        phone: decoded?.phone || '',
        birthdate: decoded?.birthdate || '',
        city: decoded?.city || '',
        postcode: decoded?.postcode || '',
        pseudo: decoded?.pseudo || '',
    });

    if (!decoded) {
        return (
            <SafeAreaView className="flex-1 bg-[#f5f0ff]" edges={[]}>
                <Header />
                <PageTransition>
                    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 14 }}>
                        <View className="bg-[#7c3aed] rounded-xl p-5">
                            <Text className="text-white font-bold text-base mb-2">CalmSpace 🌿</Text>
                            <Text className="text-purple-200 text-sm">Connectez-vous pour accéder à votre espace personnel, votre journal d'émotions et vos favoris.</Text>
                        </View>
                        <View className="bg-white rounded-xl p-5" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            <Text className="text-base font-bold text-gray-900 mb-1">J'ai déjà un compte</Text>
                            <Text className="text-sm text-gray-600 mb-4">Retrouvez votre espace et votre historique.</Text>
                            <TouchableOpacity onPress={() => router.push('/pages/connexion')} className="bg-[#7c3aed] rounded-lg py-3 items-center" activeOpacity={0.8}>
                                <Text className="text-white font-semibold">Se connecter</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-white rounded-xl p-5" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            <Text className="text-base font-bold text-gray-900 mb-1">Créer un compte</Text>
                            <Text className="text-sm text-gray-600 mb-4">Rejoignez CalmSpace gratuitement.</Text>
                            <TouchableOpacity onPress={() => router.push('/pages/inscription')} className="bg-white border border-[#7c3aed] rounded-lg py-3 items-center" activeOpacity={0.8}>
                                <Text className="text-[#7c3aed] font-semibold">S'inscrire</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-[#f5f0ff] rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#7c3aed' }}>
                            <Text className="text-xs font-bold text-gray-900">🔒 Service sécurisé et gratuit</Text>
                            <Text className="text-xs text-gray-700 mt-1">Vos données sont protégées conformément au RGPD.</Text>
                        </View>
                    </ScrollView>
                </PageTransition>
            </SafeAreaView>
        );
    }

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <View className="pb-3 mb-1" style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</Text>
            <Text className="text-sm text-gray-900 font-medium">{value || 'Non renseigné'}</Text>
        </View>
    );

    const handleSave = async () => {
        setErrorMsg(''); setSuccessMsg('');
        try {
            await updateProfile(formData);
            setSuccessMsg('Profil mis à jour avec succès.');
            setIsEditing(false);
        } catch {
            setErrorMsg('Une erreur est survenue.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f0ff]" edges={[]}>
            <Header />
            <PageTransition>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-4 pt-5 pb-8">
                        <Text className="text-2xl font-bold text-gray-900 mb-1">Mon profil</Text>
                        <Text className="text-sm text-gray-500 mb-5">Gérez vos informations personnelles</Text>

                        {successMsg ? (
                            <View className="mb-4 bg-green-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
                                <Text className="text-green-700 font-bold text-sm">{successMsg}</Text>
                            </View>
                        ) : null}
                        {errorMsg ? (
                            <View className="mb-4 bg-red-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
                                <Text className="text-red-600 font-bold text-sm">{errorMsg}</Text>
                            </View>
                        ) : null}

                        <View className="bg-white rounded-xl mb-4 p-5" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            {!isEditing ? (
                                <>
                                    <Text className="text-base font-bold text-gray-900 mb-3 pb-2" style={{ borderBottomWidth: 2, borderBottomColor: '#7c3aed' }}>Identité</Text>
                                    <InfoRow label="Civilité" value={decoded.civility} />
                                    <InfoRow label="Pseudo" value={decoded.pseudo} />
                                    <InfoRow label="Nom" value={decoded.lastname} />
                                    <InfoRow label="Prénom" value={decoded.firstname} />
                                    <InfoRow label="Date de naissance" value={formatDate(decoded.birthdate)} />

                                    <Text className="text-base font-bold text-gray-900 mb-3 mt-4 pb-2" style={{ borderBottomWidth: 2, borderBottomColor: '#7c3aed' }}>Coordonnées</Text>
                                    <InfoRow label="Email" value={decoded.email} />
                                    <InfoRow label="Téléphone" value={decoded.phone || 'Non renseigné'} />
                                    <InfoRow label="Ville" value={decoded.city} />
                                    <InfoRow label="Code postal" value={decoded.postcode} />

                                    <Text className="text-base font-bold text-gray-900 mb-3 mt-4 pb-2" style={{ borderBottomWidth: 2, borderBottomColor: '#7c3aed' }}>Compte</Text>
                                    <View className="pb-3 mb-3" style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                                        <Text className="text-xs font-bold text-gray-400 uppercase mb-1">Rôle</Text>
                                        <View className="self-start bg-[#f5f0ff] px-3 py-1 rounded">
                                            <Text className="text-[#7c3aed] text-xs font-bold uppercase">{decoded.role}</Text>
                                        </View>
                                    </View>
                                    <InfoRow label="Membre depuis" value={formatDate(decoded.created)} />

                                    <View style={{ gap: 10, marginTop: 16 }}>
                                        <TouchableOpacity onPress={() => setIsEditing(true)} className="bg-[#7c3aed] rounded-lg py-3 items-center" activeOpacity={0.8}>
                                            <Text className="text-white font-medium text-sm">Modifier mon profil</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={logout} className="bg-white border border-red-400 rounded-lg py-3 items-center" activeOpacity={0.8}>
                                            <Text className="text-red-500 font-medium text-sm">Se déconnecter</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <>
                                    {['pseudo', 'lastname', 'firstname', 'email', 'phone', 'city', 'postcode'].map(field => (
                                        <View key={field} className="mb-4">
                                            <Text className="text-sm font-bold text-gray-900 mb-1 capitalize">{field}</Text>
                                            <TextInput
                                                value={(formData as any)[field]}
                                                onChangeText={(v) => setFormData({ ...formData, [field]: v })}
                                                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                                                autoCapitalize="none"
                                                keyboardType={field === 'email' ? 'email-address' : field === 'postcode' ? 'number-pad' : 'default'}
                                            />
                                        </View>
                                    ))}
                                    <View style={{ gap: 10, marginTop: 8 }}>
                                        <TouchableOpacity onPress={handleSave} className="bg-[#7c3aed] rounded-lg py-3 items-center" activeOpacity={0.8}>
                                            <Text className="text-white font-medium text-sm">Enregistrer</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setIsEditing(false)} className="bg-white border border-gray-300 rounded-lg py-3 items-center" activeOpacity={0.8}>
                                            <Text className="text-gray-700 font-medium text-sm">Annuler</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>

                        {/* Liens rapides */}
                        <View className="bg-white rounded-xl overflow-hidden" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            {[
                                { label: 'Mes favoris', icon: 'bookmark-outline', path: '/pages/favoris' },
                                { label: 'Historique émotions', icon: 'heart-outline', path: '/pages/historique-emotions' },
                                { label: 'Mon diagnostic', icon: 'clipboard-outline', path: '/pages/diagnostic' },
                            ].map((item, i, arr) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => router.push(item.path as any)}
                                    className="flex-row items-center justify-between px-5 py-4"
                                    style={{ borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: '#f3f4f6' }}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center" style={{ gap: 12 }}>
                                        <Ionicons name={item.icon as any} size={20} color="#7c3aed" />
                                        <Text className="text-sm font-medium text-gray-900">{item.label}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
