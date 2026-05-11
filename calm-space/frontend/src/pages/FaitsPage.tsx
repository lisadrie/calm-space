import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon as HeartOutline,
  ArrowRightIcon,
  ArrowPathIcon,
  SparklesIcon,
  StarIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Navigation from '../components/Navigation';
import { useAuth, API_URL } from '../hooks/useAuth';
import { REASSURING_FACTS, FUN_FACTS } from '../constants/facts';

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
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { decoded } = useAuth();
  const navigate = useNavigate();

  const loadFavorites = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/favorites`, { credentials: 'include' });
      if (res.ok) setFavorites(await res.json());
      else notify('Impossible de charger les favoris.', 'error');
    } catch {
      notify('Erreur de connexion au serveur.', 'error');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (decoded) loadFavorites();
    else setFavorites([]);
  }, [decoded, loadFavorites]);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 2800);
  };

  const currentFacts = showReassuring ? REASSURING_FACTS : FUN_FACTS;
  const currentFactType = showReassuring ? 'reassuring' : 'fun';
  const favoriteTexts = favorites.filter(f => f.fact_type === currentFactType).map(f => f.fact_text);
  const displayedFacts = showFavorites ? currentFacts.filter(f => favoriteTexts.includes(f)) : currentFacts;

  const getNextFact = () => {
    if (displayedFacts.length > 1)
      setCurrentIndex(prev => (prev + 1) % displayedFacts.length);
  };

  const getRandomFact = () => {
    if (displayedFacts.length > 1) {
      let next;
      do { next = Math.floor(Math.random() * displayedFacts.length); }
      while (next === currentIndex);
      setCurrentIndex(next);
    }
  };

  const isFavorite = (fact: string) =>
    favorites.some(f => f.fact_text === fact && f.fact_type === currentFactType);

  const toggleFavorite = async (fact: string) => {
    if (!decoded) { navigate('/connexion'); return; }
    setLoading(true);
    const existing = favorites.find(f => f.fact_text === fact && f.fact_type === currentFactType);

    try {
      if (existing) {
        const res = await fetch(`${API_URL}/favorites/${existing.id}`, {
          method: 'DELETE', credentials: 'include',
        });
        if (res.ok) {
          setFavorites(prev => prev.filter(f => f.id !== existing.id));
          notify('Retiré des favoris');
        } else {
          notify('Impossible de retirer ce favori.', 'error');
        }
      } else {
        const res = await fetch(`${API_URL}/favorites`, {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fact_text: fact, fact_type: currentFactType }),
        });
        if (res.ok) {
          const newFav = await res.json();
          setFavorites(prev => [...prev, newFav]);
          notify('Ajouté aux favoris');
        } else {
          notify("Impossible d'ajouter ce favori.", 'error');
        }
      }
    } catch {
      notify('Erreur de connexion au serveur.', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { setCurrentIndex(0); }, [showFavorites, showReassuring]);

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      {notification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl font-medium text-sm animate-fade-in border shadow-glow ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-white border-purple-200 text-purple-700'
        }`}>
          {notification.text}
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

        {!decoded && (
          <div className="calm-card p-4 mb-6 flex items-center justify-between animate-fade-in">
            <p className="text-sm text-gray-500">Connecte-toi pour sauvegarder tes favoris</p>
            <button onClick={() => navigate('/connexion')} className="btn-primary text-sm py-1.5 px-4">Connexion</button>
          </div>
        )}

        {/* Type toggle */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowReassuring(true)}
              className={`inline-flex items-center gap-2 text-sm ${showReassuring ? 'btn-primary' : 'btn-outline'}`}
            >
              <SparklesIcon className="w-4 h-4" /> Réconfortants
            </button>
            <button
              onClick={() => setShowReassuring(false)}
              className={`inline-flex items-center gap-2 text-sm ${!showReassuring ? 'btn-primary' : 'btn-outline'}`}
            >
              <StarIcon className="w-4 h-4" /> Amusants
            </button>
          </div>
          {decoded && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`inline-flex items-center gap-2 text-sm ${showFavorites ? 'btn-primary' : 'btn-outline'}`}
              >
                <BookmarkIcon className="w-4 h-4" />
                {showFavorites ? 'Voir tout' : `Mes favoris (${favoriteTexts.length})`}
              </button>
            </div>
          )}
        </div>

        {/* Fact card */}
        {displayedFacts.length > 0 ? (
          <div className="calm-card p-8 md:p-12 animate-scale-in">
            <div className="text-center space-y-6">
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))', boxShadow: '0 0 40px rgba(147,89,210,0.3)' }}
              >
                {showReassuring
                  ? <SparklesIcon className="w-8 h-8 text-white" />
                  : <StarIcon className="w-8 h-8 text-white" />
                }
              </div>

              <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium">
                {displayedFacts[currentIndex]}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => toggleFavorite(displayedFacts[currentIndex])}
                  disabled={loading || !decoded}
                  className={`inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-medium text-sm border-2 transition-colors disabled:opacity-50 ${
                    isFavorite(displayedFacts[currentIndex])
                      ? 'border-red-300 text-red-500 hover:bg-red-50'
                      : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {isFavorite(displayedFacts[currentIndex])
                    ? <HeartSolid className="w-4 h-4 text-red-500" />
                    : <HeartOutline className="w-4 h-4" />
                  }
                  {isFavorite(displayedFacts[currentIndex]) ? 'En favori' : 'Favori'}
                </button>

                <button onClick={getNextFact} className="btn-primary text-sm inline-flex items-center gap-2">
                  Suivant <ArrowRightIcon className="w-4 h-4" />
                </button>

                <button onClick={getRandomFact} className="btn-outline text-sm inline-flex items-center gap-2">
                  <ArrowPathIcon className="w-4 h-4" /> Aléatoire
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="calm-card p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 flex items-center justify-center">
              <HeartOutline className="w-8 h-8 text-purple-300" />
            </div>
            <p className="text-gray-500 text-lg">Pas encore de favoris.</p>
            <p className="text-gray-400 text-sm mt-1">Clique sur le cœur pour en sauvegarder !</p>
          </div>
        )}

        {displayedFacts.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-6">
            {currentIndex + 1} / {displayedFacts.length}
            {showFavorites && ` favori${displayedFacts.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </main>
    </div>
  );
};

export default FaitsPage;
