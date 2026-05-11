import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../../components/PageHeader';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';
import { API_URL } from '../../config';

const EVENTS = [
    { event: 'Décès du conjoint', score: 100 },
    { event: 'Divorce', score: 73 },
    { event: 'Séparation conjugale', score: 65 },
    { event: 'Emprisonnement', score: 63 },
    { event: 'Décès d\'un proche', score: 63 },
    { event: 'Blessure ou maladie grave', score: 53 },
    { event: 'Mariage', score: 50 },
    { event: 'Licenciement', score: 47 },
    { event: 'Réconciliation conjugale', score: 45 },
    { event: 'Retraite', score: 45 },
    { event: 'Maladie d\'un proche', score: 44 },
    { event: 'Grossesse', score: 40 },
    { event: 'Problèmes sexuels', score: 39 },
    { event: 'Nouvel arrivant dans la famille', score: 39 },
    { event: 'Changement professionnel majeur', score: 39 },
    { event: 'Changement de situation financière', score: 38 },
    { event: 'Décès d\'un ami', score: 37 },
    { event: 'Changement de métier', score: 36 },
    { event: 'Conflits conjugaux', score: 35 },
    { event: 'Emprunt important', score: 31 },
    { event: 'Saisie ou perte d\'un bien', score: 30 },
    { event: 'Changement de responsabilités', score: 29 },
    { event: 'Enfant quittant le foyer', score: 29 },
    { event: 'Difficultés avec la belle-famille', score: 29 },
    { event: 'Succès personnel exceptionnel', score: 28 },
    { event: 'Conjoint commençant ou arrêtant de travailler', score: 26 },
    { event: 'Début ou fin de scolarité', score: 26 },
    { event: 'Changement de conditions de vie', score: 25 },
    { event: 'Changement d\'habitudes personnelles', score: 24 },
    { event: 'Difficultés avec l\'employeur', score: 23 },
    { event: 'Changement d\'horaires ou conditions de travail', score: 20 },
    { event: 'Déménagement', score: 20 },
    { event: 'Changement d\'école', score: 20 },
    { event: 'Changement d\'activités récréatives', score: 19 },
    { event: 'Changement d\'activités religieuses', score: 19 },
    { event: 'Changement d\'activités sociales', score: 18 },
    { event: 'Petit emprunt', score: 17 },
    { event: 'Changement dans les habitudes de sommeil', score: 16 },
    { event: 'Changement dans les réunions de famille', score: 15 },
    { event: 'Changement dans les habitudes alimentaires', score: 15 },
    { event: 'Vacances', score: 13 },
    { event: 'Noël / fêtes de fin d\'année', score: 12 },
    { event: 'Infractions mineures à la loi', score: 11 },
];

const getResult = (score: number) => {
    if (score < 150) return { level: 'Faible', color: '#10b981', bg: '#ecfdf5', border: '#10b981', desc: 'Votre niveau de stress est faible. Continuez à prendre soin de vous !' };
    if (score < 300) return { level: 'Modéré', color: '#f59e0b', bg: '#fffbeb', border: '#f59e0b', desc: 'Vous êtes dans une période de changements. Pratiquez la respiration et prenez du recul.' };
    return { level: 'Élevé', color: '#ef4444', bg: '#fef2f2', border: '#ef4444', desc: 'Votre niveau de stress est élevé. Il est conseillé de consulter un professionnel de santé.' };
};

export default function DiagnosticPage() {
    const { token } = useAuth();
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [showResult, setShowResult] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggle = (i: number) => {
        const next = new Set(selected);
        next.has(i) ? next.delete(i) : next.add(i);
        setSelected(next);
    };

    const total = Array.from(selected).reduce((sum, i) => sum + EVENTS[i].score, 0);
    const result = getResult(total);

    const handleSave = async () => {
        if (!token) return;
        try {
            await fetch(`${API_URL}/stress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ total_score: total, selected_events: Array.from(selected).map(i => EVENTS[i].event) }),
            });
            setSaved(true);
        } catch { }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <PageHeader title="Diagnostic stress" />
            <PageTransition>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-4 pt-5 pb-8">
                        <Text className="text-2xl font-bold text-gray-900 mb-1">Échelle de Holmes & Rahe</Text>
                        <Text className="text-sm text-gray-600 mb-5">
                            Cochez les événements vécus ces 12 derniers mois pour évaluer votre niveau de stress.
                        </Text>

                        {EVENTS.map((ev, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => toggle(i)}
                                className={`flex-row items-center justify-between px-4 py-3 mb-2 rounded-xl border ${selected.has(i) ? 'bg-[#f5f0ff] border-[#7c3aed]' : 'bg-white border-gray-100'}`}
                                style={{ shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 }}
                                activeOpacity={0.75}
                            >
                                <View className="flex-row items-center flex-1" style={{ gap: 10 }}>
                                    <View className="w-5 h-5 border-2 rounded items-center justify-center" style={{ borderColor: selected.has(i) ? '#7c3aed' : '#d1d5db', backgroundColor: selected.has(i) ? '#7c3aed' : 'transparent' }}>
                                        {selected.has(i) && <Text className="text-white text-xs font-bold">✓</Text>}
                                    </View>
                                    <Text className="text-sm text-gray-800 flex-1">{ev.event}</Text>
                                </View>
                                <Text className="text-xs font-bold text-gray-400 ml-2">{ev.score}</Text>
                            </TouchableOpacity>
                        ))}

                        {/* Score en direct */}
                        <View className="bg-[#f5f0ff] rounded-xl p-4 mt-4 mb-4" style={{ borderLeftWidth: 4, borderLeftColor: '#7c3aed' }}>
                            <Text className="text-sm text-gray-600 mb-1">Score total : <Text className="font-bold text-[#7c3aed] text-lg">{total}</Text></Text>
                            <Text className="text-xs text-gray-500">{selected.size} événement(s) sélectionné(s)</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setShowResult(true)}
                            className="bg-[#7c3aed] rounded-xl py-3 items-center mb-4"
                            activeOpacity={0.85}
                        >
                            <Text className="text-white font-bold">Voir mon résultat</Text>
                        </TouchableOpacity>

                        {showResult && (
                            <View className="rounded-xl p-5 mb-4" style={{ backgroundColor: result.bg, borderLeftWidth: 4, borderLeftColor: result.border }}>
                                <Text className="text-lg font-bold mb-1" style={{ color: result.color }}>
                                    Niveau : {result.level}
                                </Text>
                                <Text className="text-3xl font-bold mb-2" style={{ color: result.color }}>{total} pts</Text>
                                <Text className="text-sm text-gray-700 mb-3">{result.desc}</Text>
                                {token && !saved && (
                                    <TouchableOpacity onPress={handleSave} className="bg-white border rounded-lg py-2 items-center" style={{ borderColor: result.border }} activeOpacity={0.8}>
                                        <Text className="font-bold text-sm" style={{ color: result.color }}>💾 Sauvegarder ce résultat</Text>
                                    </TouchableOpacity>
                                )}
                                {saved && <Text className="text-green-600 font-bold text-sm text-center">✓ Résultat sauvegardé !</Text>}
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => { setSelected(new Set()); setShowResult(false); setSaved(false); }}
                            className="bg-gray-100 rounded-xl py-3 items-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-gray-600 font-medium">Recommencer</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
