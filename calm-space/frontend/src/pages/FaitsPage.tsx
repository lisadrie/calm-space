import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth, API } from '../hooks/useAuth';

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

const FaitsPage = () => {
  const [showReassuring, setShowReassuring] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const { decoded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (decoded) loadFavorites();
    else setFavorites([]);
  }, [decoded]);

  const loadFavorites = async () => {
    try {
      const res = await fetch(`${API}/favorites`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error(err);
    }
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
    if (displayedFacts.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % displayedFacts.length);
    }
  };

  const isFavorite = (fact: string) =>
    favorites.some(f => f.fact_text === fact && f.fact_type === currentFactType);

  const toggleFavorite = async (fact: string) => {
    if (!decoded) {
      navigate('/connexion');
      return;
    }
    setLoading(true);
    const existing = favorites.find(f => f.fact_text === fact && f.fact_type === currentFactType);

    if (existing) {
      try {
        const res = await fetch(`${API}/favorites/${existing.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          setFavorites(prev => prev.filter(f => f.id !== existing.id));
          notify('Retiré des favoris');
        }
      } catch (err) { console.error(err); }
    } else {
      try {
        const res = await fetch(`${API}/favorites`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fact_text: fact, fact_type: currentFactType }),
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(prev => [...prev, data]);
          notify('Ajouté aux favoris ❤️');
        }
      } catch (err) { console.error(err); }
    }
    setLoading(false);
  };

  useEffect(() => { setCurrentIndex(0); }, [showFavorites, showReassuring]);

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      {/* Notification toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-purple-200 shadow-glow px-5 py-3 rounded-2xl text-purple-700 font-medium text-sm animate-fade-in">
          {notification}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {showReassuring ? 'Faits Réconfortants' : 'Faits Amusants'}
          </h1>
          <p className="text-gray-500 text-lg">
            {showReassuring
              ? "De doux rappels pour t'aider à te sentir ancré(e)"
              : "Des faits délicieux pour illuminer ta journée"}
          </p>
        </div>

        {/* Not logged in banner */}
        {!decoded && (
          <div className="calm-card p-4 mb-6 flex items-center justify-between animate-fade-in">
            <p className="text-sm text-gray-500">Connecte-toi pour sauvegarder tes favoris</p>
            <button onClick={() => navigate('/connexion')} className="btn-primary text-sm py-1.5 px-4">
              Connexion
            </button>
          </div>
        )}

        {/* Toggle type */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowReassuring(true)}
              className={showReassuring ? 'btn-primary text-sm' : 'btn-outline text-sm'}
            >
              ✨ Réconfortants
            </button>
            <button
              onClick={() => setShowReassuring(false)}
              className={!showReassuring ? 'btn-primary text-sm' : 'btn-outline text-sm'}
            >
              🎉 Amusants
            </button>
          </div>

          {decoded && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={showFavorites ? 'btn-primary text-sm' : 'btn-outline text-sm'}
              >
                {showFavorites ? '❤️ Voir tout' : '🤍 Mes favoris'}
              </button>
            </div>
          )}
        </div>

        {/* Fact card */}
        {displayedFacts.length > 0 ? (
          <div className="calm-card p-8 md:p-12 animate-scale-in">
            <div className="text-center space-y-6">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))', boxShadow: '0 0 40px rgba(147,89,210,0.3)' }}
              >
                ✨
              </div>

              <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium">
                {displayedFacts[currentIndex]}
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => toggleFavorite(displayedFacts[currentIndex])}
                  disabled={loading || !decoded}
                  className={`inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-medium text-sm border-2 transition-colors disabled:opacity-50 ${
                    isFavorite(displayedFacts[currentIndex])
                      ? 'border-red-300 text-red-500 hover:bg-red-50'
                      : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {isFavorite(displayedFacts[currentIndex]) ? '❤️' : '🤍'}
                  {isFavorite(displayedFacts[currentIndex]) ? 'En favori' : 'Favori'}
                </button>

                <button onClick={getNextFact} className="btn-primary text-sm inline-flex items-center gap-2">
                  🔄 Suivant
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="calm-card p-8 text-center">
            <p className="text-gray-500 text-lg">
              Pas encore de favoris. Clique sur 🤍 pour en sauvegarder !
            </p>
          </div>
        )}

        {displayedFacts.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-6">
            {currentIndex + 1} sur {displayedFacts.length}
            {showFavorites && ` favori${displayedFacts.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </main>
    </div>
  );
};

export default FaitsPage;
