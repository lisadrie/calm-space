import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

const API_URL = 'http://172.20.10.3:5001'; // ⚠️ Remplace par ton IP locale ex: http://192.168.1.XX:5001

const reassuringFacts = [
    "Tu t'en sors mieux que tu ne le penses.",
    "90% des choses qui nous inquiètent n'arrivent jamais.",
    "Ton cœur a battu des milliards de fois sans que tu n'aies à y penser.",
    "L'anxiété est temporaire. Tu as survécu à 100% de tes pires journées.",
    "Prendre un moment pour respirer n'est jamais du temps perdu.",
    "C'est normal de ne pas aller bien parfois. C'est ça être humain.",
    "Les petits pas en avant restent des progrès.",
    "Tu es plus fort(e) que ce que ton anxiété te dit.",
    "Chaque nouvelle minute est une chance de recommencer à zéro.",
    "Tu n'as pas besoin d'être productif pour avoir de la valeur.",
    "Ton existence est une probabilité d'une sur 400 trillions. Tu es un miracle.",
    "Il y a des gens que tu n'as pas encore rencontrés qui vont t'adorer.",
    "La sensation de panique dure en moyenne moins de 20 minutes.",
    "Tu as le droit de dire non pour protéger ta paix intérieure.",
    "Même les arbres perdent leurs feuilles pour mieux repousser ensuite.",
    "Personne ne sait vraiment ce qu'il fait, on apprend tous en avançant.",
    "Ta valeur ne dépend pas de l'opinion des autres.",
    "Le cerveau a une capacité incroyable à guérir et à s'adapter.",
    "Il est mathématiquement certain que tu as déjà inspiré quelqu'un.",
    "Le monde est plus vaste que tes pensées actuelles.",
    "Il y a une place dans ce monde que seul(e) toi peux occuper.",
    "Ton corps travaille 24h/24 pour te maintenir en vie car il t'aime.",
    "Les erreurs sont les preuves que tu es en train d'essayer.",
    "Tu n'es pas obligé(e) de croire tout ce que ton esprit te dit quand tu es fatigué(e).",
    "La gentillesse que tu donnes finit toujours par te revenir d'une façon ou d'une autre.",
    "Ton passé est un guide, pas une prison.",
    "À cet instant précis, des millions de personnes ressentent la même chose que toi.",
    "Le repos n'est pas une récompense, c'est un besoin fondamental.",
    "Tu as déjà surmonté des choses que tu pensais impossibles autrefois.",
    "Le soleil se lève chaque jour, peu importe à quel point la nuit a été sombre.",
    "La vulnérabilité est une forme de courage, pas de faiblesse.",
    "L'autocompassion est plus efficace que l'autocritique pour progresser.",
    "Chaque respiration est un nouveau départ.",
    "Tu n'as pas besoin d'être parfait(e) pour être aimé(e).",
    "La personne que tu seras dans 5 ans te remercie de ne pas avoir abandonné aujourd'hui.",
];

const funFacts = [
    "Les loutres se tiennent par la main quand elles dorment pour ne pas dériver.",
    "Les manchots font leur demande en mariage avec un caillou.",
    "Les vaches ont des meilleures amies et sont stressées quand elles sont séparées.",
    "Un groupe de flamants roses s'appelle une 'flamboyance'.",
    "Les abeilles peuvent reconnaître les visages humains.",
    "La Norvège a fait chevalier un manchot en 2008.",
    "Les rats et les chiens rigolent quand on les chatouille.",
    "Les écureuils plantent des milliers d'arbres en oubliant leurs cachettes.",
    "Les éléphants pensent que les humains sont 'mignons'.",
    "Les corbeaux se font des cadeaux pour renforcer leurs liens.",
    "Les chats ne miaulent que pour communiquer avec les humains.",
    "Les papillons goûtent avec leurs pattes.",
    "Les wombats font des crottes en forme de cubes.",
    "Une journée sur Vénus est plus longue qu'une année sur Vénus.",
    "Les astronautes grandissent de quelques centimètres dans l'espace.",
    "L'odeur de l'espace ressemble à celle d'un steak grillé ou de métal chaud.",
    "Les pieuvres ont trois cœurs et le sang bleu.",
    "Il pleut des diamants sur Jupiter et Saturne.",
    "Les bananes sont techniquement des baies, mais les fraises ne le sont pas.",
    "Les requins existent depuis plus longtemps que les arbres.",
    "Le miel est le seul aliment qui ne périme jamais.",
    "Il y a plus d'arbres sur Terre que d'étoiles dans la Voie Lactée.",
    "Les hippopotames produisent une sueur rose qui sert de crème solaire.",
    "Les arbres communiquent entre eux via un réseau souterrain de champignons.",
    "Il existe une espèce de méduse qui est biologiquement immortelle.",
    "Les escargots peuvent dormir pendant trois ans.",
    "Les flamants roses sont roses uniquement à cause des crevettes qu'ils mangent.",
    "Le ketchup était vendu comme médicament dans les années 1830.",
    "Ton ADN pourrait s'étirer de la Terre à Pluton et revenir 17 fois.",
    "Les cochons sont incapables de regarder le ciel physiquement.",
];

interface Favorite {
    id: number;
    fact_text: string;
    fact_type: string;
}

export default function FaitsTab() {
    const { decoded, token } = useAuth();
    const router = useRouter();
    const [showReassuring, setShowReassuring] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        if (decoded && token) loadFavorites();
        else setFavorites([]);
    }, [decoded]);

    useEffect(() => { setCurrentIndex(0); }, [showFavorites, showReassuring]);

    const loadFavorites = async () => {
        try {
            const res = await fetch(`${API_URL}/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setFavorites(await res.json());
        } catch { }
    };

    const notify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 2500);
    };

    const currentFacts = showReassuring ? reassuringFacts : funFacts;
    const currentFactType = showReassuring ? 'reassuring' : 'fun';
    const favoriteTexts = favorites.filter(f => f.fact_type === currentFactType).map(f => f.fact_text);
    const displayedFacts = showFavorites ? currentFacts.filter(f => favoriteTexts.includes(f)) : currentFacts;

    const getNextFact = () => {
        if (displayedFacts.length > 0) setCurrentIndex(prev => (prev + 1) % displayedFacts.length);
    };

    const isFavorite = (fact: string) =>
        favorites.some(f => f.fact_text === fact && f.fact_type === currentFactType);

    const toggleFavorite = async (fact: string) => {
        if (!decoded) { router.push('/pages/connexion'); return; }
        setLoading(true);
        const existing = favorites.find(f => f.fact_text === fact && f.fact_type === currentFactType);
        if (existing) {
            try {
                const res = await fetch(`${API_URL}/favorites/${existing.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    setFavorites(prev => prev.filter(f => f.id !== existing.id));
                    notify('Retiré des favoris');
                }
            } catch { }
        } else {
            try {
                const res = await fetch(`${API_URL}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ fact_text: fact, fact_type: currentFactType }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setFavorites(prev => [...prev, data]);
                    notify('Ajouté aux favoris ❤️');
                }
            } catch { }
        }
        setLoading(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f0ff]" edges={[]}>
            <Header />
            <PageTransition>
                {/* Toast */}
                {notification ? (
                    <View className="absolute top-4 left-4 right-4 z-50 bg-white rounded-2xl px-5 py-3 items-center"
                        style={{ shadowColor: '#7c3aed', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 }}>
                        <Text className="text-[#7c3aed] font-medium text-sm">{notification}</Text>
                    </View>
                ) : null}

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>

                    {/* Titre */}
                    <View className="items-center mb-2">
                        <Text className="text-2xl font-bold text-gray-900">
                            {showReassuring ? '✨ Faits Réconfortants' : '🎉 Faits Amusants'}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1 text-center">
                            {showReassuring
                                ? "De doux rappels pour t'aider à te sentir ancré(e)"
                                : "Des faits délicieux pour illuminer ta journée"}
                        </Text>
                    </View>

                    {/* Banner non connecté */}
                    {!decoded && (
                        <View className="bg-white rounded-xl p-4 flex-row items-center justify-between"
                            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            <Text className="text-sm text-gray-500 flex-1 mr-3">Connecte-toi pour sauvegarder tes favoris</Text>
                            <TouchableOpacity onPress={() => router.push('/pages/connexion')} className="bg-[#7c3aed] rounded-lg px-4 py-2" activeOpacity={0.8}>
                                <Text className="text-white text-sm font-medium">Connexion</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Toggle Réconfortants / Amusants */}
                    <View className="flex-row justify-center" style={{ gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => setShowReassuring(true)}
                            className={`px-5 py-2.5 rounded-xl border ${showReassuring ? 'bg-[#7c3aed] border-[#7c3aed]' : 'bg-white border-gray-200'}`}
                            activeOpacity={0.8}
                        >
                            <Text className={`text-sm font-medium ${showReassuring ? 'text-white' : 'text-gray-700'}`}>✨ Réconfortants</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowReassuring(false)}
                            className={`px-5 py-2.5 rounded-xl border ${!showReassuring ? 'bg-[#7c3aed] border-[#7c3aed]' : 'bg-white border-gray-200'}`}
                            activeOpacity={0.8}
                        >
                            <Text className={`text-sm font-medium ${!showReassuring ? 'text-white' : 'text-gray-700'}`}>🎉 Amusants</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Toggle Favoris */}
                    {decoded && (
                        <View className="items-center">
                            <TouchableOpacity
                                onPress={() => setShowFavorites(!showFavorites)}
                                className={`px-5 py-2.5 rounded-xl border ${showFavorites ? 'bg-[#7c3aed] border-[#7c3aed]' : 'bg-white border-gray-200'}`}
                                activeOpacity={0.8}
                            >
                                <Text className={`text-sm font-medium ${showFavorites ? 'text-white' : 'text-gray-700'}`}>
                                    {showFavorites ? '❤️ Voir tout' : '🤍 Mes favoris'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Carte fait */}
                    {displayedFacts.length > 0 ? (
                        <View className="bg-white rounded-2xl p-8 items-center"
                            style={{ shadowColor: '#7c3aed', shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 }}>
                            <View className="w-16 h-16 rounded-full items-center justify-center mb-5 bg-[#7c3aed]">
                                <Text className="text-2xl">✨</Text>
                            </View>
                            <Text className="text-lg text-gray-800 font-medium text-center leading-7 mb-6">
                                {displayedFacts[currentIndex]}
                            </Text>
                            <View className="flex-row" style={{ gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => toggleFavorite(displayedFacts[currentIndex])}
                                    disabled={loading || !decoded}
                                    className={`flex-row items-center px-5 py-2.5 rounded-xl border-2 ${isFavorite(displayedFacts[currentIndex]) ? 'border-red-300 bg-red-50' : 'border-[#7c3aed] bg-[#f5f0ff]'}`}
                                    style={{ opacity: !decoded ? 0.5 : 1 }}
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-sm font-medium mr-1">{isFavorite(displayedFacts[currentIndex]) ? '❤️' : '🤍'}</Text>
                                    <Text className={`text-sm font-medium ${isFavorite(displayedFacts[currentIndex]) ? 'text-red-500' : 'text-[#7c3aed]'}`}>
                                        {isFavorite(displayedFacts[currentIndex]) ? 'En favori' : 'Favori'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={getNextFact} className="flex-row items-center bg-[#7c3aed] px-5 py-2.5 rounded-xl" activeOpacity={0.85}>
                                    <Text className="text-white text-sm font-medium">🔄 Suivant</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View className="bg-white rounded-2xl p-8 items-center"
                            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                            <Text className="text-gray-500 text-center">Pas encore de favoris. Clique sur 🤍 pour en sauvegarder !</Text>
                        </View>
                    )}

                    {/* Compteur */}
                    {displayedFacts.length > 0 && (
                        <Text className="text-center text-sm text-gray-400">
                            {currentIndex + 1} sur {displayedFacts.length}
                            {showFavorites ? ` favori${displayedFacts.length !== 1 ? 's' : ''}` : ''}
                        </Text>
                    )}
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
