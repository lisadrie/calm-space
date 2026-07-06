import {
    ActivityIndicator, Keyboard, Modal, Platform,
    ScrollView, Text, TextInput, TouchableOpacity,
    TouchableWithoutFeedback, View,
} from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';

const Field = ({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) => (
    <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
            {label}{required && <Text className="text-red-500"> *</Text>}
        </Text>
        {children}
    </View>
);

const formatDateFR = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function InscriptionPage() {
    const { message, error, Signup, clearMessages } = useAuth();
    const router = useRouter();

    const [civility, setCivility]               = useState('');
    const [firstname, setFirstname]             = useState('');
    const [lastname, setLastname]               = useState('');
    const [email, setEmail]                     = useState('');
    const [phone, setPhone]                     = useState('');
    const [birthdate, setBirthdate]             = useState('');
    const [birthdateDate, setBirthdateDate]     = useState<Date>(new Date(2000, 0, 1));
    const [tempDate, setTempDate]               = useState<Date>(new Date(2000, 0, 1));
    const [showDatePicker, setShowDatePicker]   = useState(false);
    const [city, setCity]                       = useState('');
    const [postcode, setPostcode]               = useState('');
    const [pseudo, setPseudo]                   = useState('');
    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cgu, setCgu]                         = useState(false);
    const [rgpd, setRgpd]                       = useState(false);
    const [submitting, setSubmitting]           = useState(false);
    const [localError, setLocalError]           = useState('');

    useEffect(() => {
        if (message === 'Compte créé avec succès !') {
            router.replace('/(tabs)');
        }
    }, [message]);

    const openDatePicker = () => {
        Keyboard.dismiss();
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: birthdateDate,
                mode: 'date',
                maximumDate: new Date(),
                minimumDate: new Date(1900, 0, 1),
                onChange: (event, date) => {
                    if (event.type === 'set' && date) {
                        setBirthdateDate(date);
                        setBirthdate(formatDateISO(date));
                    }
                },
            });
        } else {
            setTempDate(birthdateDate);
            setShowDatePicker(true);
        }
    };

    const confirmDate = () => {
        setBirthdateDate(tempDate);
        setBirthdate(formatDateISO(tempDate));
        setShowDatePicker(false);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        Keyboard.dismiss();
        setLocalError('');

        if (!civility) { setLocalError('Veuillez sélectionner une civilité.'); return; }
        if (!firstname.trim() || !lastname.trim()) { setLocalError('Prénom et nom sont obligatoires.'); return; }
        if (!email.trim()) { setLocalError('Adresse e-mail obligatoire.'); return; }
        if (!birthdate) { setLocalError('Date de naissance obligatoire.'); return; }
        if (!city.trim() || !postcode.trim()) { setLocalError('Ville et code postal obligatoires.'); return; }
        if (!pseudo.trim()) { setLocalError('Pseudo obligatoire.'); return; }
        if (!password) { setLocalError('Mot de passe obligatoire.'); return; }
        if (password !== confirmPassword) { setLocalError('Les mots de passe ne correspondent pas.'); return; }
        if (!cgu || !rgpd) { setLocalError('Vous devez accepter les CGU et la politique RGPD pour continuer.'); return; }

        clearMessages();
        setSubmitting(true);
        await Signup(civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password, confirmPassword);
        setSubmitting(false);
    };

    const inputClass = "border border-gray-300 rounded-lg px-4 py-3 text-gray-900";
    const disabledStyle = { opacity: submitting ? 0.6 : 1 } as const;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <PageHeader title="Créer un compte" />
            <PageTransition>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ flex: 1 }}>
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            <View className="px-4 pt-5 pb-8">
                                <Text className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</Text>
                                <Text className="text-sm text-gray-600 mb-5">Rejoignez CalmSpace gratuitement</Text>

                                {/* Civilité */}
                                <Text className="text-sm font-medium text-gray-700 mb-2">Civilité <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-300 rounded-lg mb-4 overflow-hidden" style={disabledStyle}>
                                    {['Madame', 'Monsieur', 'Autre'].map((opt, i) => (
                                        <TouchableOpacity
                                            key={opt}
                                            onPress={() => !submitting && setCivility(opt)}
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
                                    <TextInput value={firstname} onChangeText={setFirstname} className={inputClass} placeholder="Votre prénom" autoCapitalize="words" editable={!submitting} />
                                </Field>
                                <Field label="Nom" required>
                                    <TextInput value={lastname} onChangeText={setLastname} className={inputClass} placeholder="Votre nom" autoCapitalize="words" editable={!submitting} />
                                </Field>
                                <Field label="Email" required>
                                    <TextInput value={email} onChangeText={setEmail} className={inputClass} placeholder="nom@domaine.fr" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} editable={!submitting} />
                                </Field>
                                <Field label="Téléphone">
                                    <TextInput value={phone} onChangeText={setPhone} className={inputClass} placeholder="0612345678" keyboardType="phone-pad" editable={!submitting} />
                                </Field>

                                {/* Date de naissance — picker natif */}
                                <Field label="Date de naissance" required>
                                    <TouchableOpacity
                                        onPress={openDatePicker}
                                        disabled={submitting}
                                        className="border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between"
                                        style={disabledStyle}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={{ color: birthdate ? '#111827' : '#9ca3af', fontSize: 16 }}>
                                            {birthdate ? formatDateFR(birthdateDate) : 'Sélectionner une date'}
                                        </Text>
                                        <Text style={{ fontSize: 18 }}>📅</Text>
                                    </TouchableOpacity>
                                </Field>

                                <Field label="Ville" required>
                                    <TextInput value={city} onChangeText={setCity} className={inputClass} placeholder="Votre ville" autoCapitalize="words" editable={!submitting} />
                                </Field>
                                <Field label="Code postal" required>
                                    <TextInput value={postcode} onChangeText={setPostcode} className={inputClass} placeholder="75001" keyboardType="number-pad" maxLength={5} editable={!submitting} />
                                </Field>
                                <Field label="Pseudo" required>
                                    <TextInput value={pseudo} onChangeText={setPseudo} className={inputClass} placeholder="VotreAlias" autoCapitalize="none" autoCorrect={false} editable={!submitting} />
                                    <Text className="text-xs text-gray-400 mt-1">3-100 caractères : lettres, chiffres, - et _</Text>
                                </Field>
                                <Field label="Mot de passe" required>
                                    <TextInput value={password} onChangeText={setPassword} className={inputClass} placeholder="6 à 16 car., 1 chiffre, 1 spécial" secureTextEntry editable={!submitting} />
                                    <Text className="text-xs text-gray-400 mt-1">6 à 16 caractères, 1 chiffre et 1 spécial (!@#$%^&*)</Text>
                                </Field>
                                <Field label="Confirmer le mot de passe" required>
                                    <TextInput value={confirmPassword} onChangeText={setConfirmPassword} className={inputClass} placeholder="Confirmer" secureTextEntry editable={!submitting} />
                                </Field>

                                {/* Consentements */}
                                {[
                                    { val: cgu,  set: setCgu,  label: "J'accepte les conditions générales d'utilisation" },
                                    { val: rgpd, set: setRgpd, label: "J'accepte la politique de protection des données (RGPD)" },
                                ].map((c, i) => (
                                    <TouchableOpacity key={i} onPress={() => !submitting && c.set(!c.val)} className="flex-row items-start mb-4" activeOpacity={0.7}>
                                        <View className="w-5 h-5 border-2 rounded mr-3 mt-0.5 items-center justify-center" style={{ borderColor: c.val ? '#7c3aed' : '#9ca3af', backgroundColor: c.val ? '#7c3aed' : 'transparent' }}>
                                            {c.val && <Text className="text-white text-xs font-bold">✓</Text>}
                                        </View>
                                        <Text className="text-sm text-gray-700 flex-1">
                                            <Text className="text-red-500">* </Text>{c.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={submitting}
                                    className="rounded-lg px-5 py-3 items-center mt-2"
                                    style={{ backgroundColor: submitting ? '#a78bfa' : '#7c3aed' }}
                                    activeOpacity={0.8}
                                >
                                    {submitting ? (
                                        <View className="flex-row items-center">
                                            <ActivityIndicator size="small" color="#fff" />
                                            <Text className="text-white font-bold ml-2">Création du compte…</Text>
                                        </View>
                                    ) : (
                                        <Text className="text-white font-bold">Créer mon compte</Text>
                                    )}
                                </TouchableOpacity>

                                {/* Erreurs et succès sous le bouton */}
                                {localError ? (
                                    <View className="mt-3 bg-orange-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#f97316' }}>
                                        <Text className="text-orange-700 text-sm font-medium">{localError}</Text>
                                    </View>
                                ) : null}
                                {error ? (
                                    <View className="mt-3 bg-red-50 rounded-xl p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
                                        <Text className="font-bold text-red-600 text-sm">{error}</Text>
                                    </View>
                                ) : null}

                                <Text className="text-center text-sm text-gray-700 mt-5">
                                    Déjà un compte ?{' '}
                                    <Text className="text-[#7c3aed] font-bold" onPress={() => router.push('/pages/connexion')}>Se connecter</Text>
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </PageTransition>

            {/* Picker iOS dans une modale bottom-sheet */}
            {Platform.OS === 'ios' && (
                <Modal transparent visible={showDatePicker} animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 32 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
                                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                            <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>Annuler</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={confirmDate}>
                                            <Text style={{ color: '#7c3aed', fontWeight: '700', fontSize: 16 }}>Confirmer</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <DateTimePicker
                                        value={tempDate}
                                        mode="date"
                                        display="spinner"
                                        locale="fr-FR"
                                        themeVariant="light"
                                        maximumDate={new Date()}
                                        minimumDate={new Date(1900, 0, 1)}
                                        onChange={(_, date) => {
                                            if (date) setTempDate(date);
                                        }}
                                        style={{ height: 200 }}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </SafeAreaView>
    );
}
