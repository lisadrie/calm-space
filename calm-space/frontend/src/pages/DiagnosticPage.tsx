import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth, API } from '../hooks/useAuth';

interface StressEvent {
  id: string;
  event_text: string;
  points: number;
  category: string;
}

const STRESS_EVENTS: StressEvent[] = [
  // Vie personnelle
  { id: '1', event_text: 'Décès du conjoint(e)', points: 100, category: 'Famille' },
  { id: '2', event_text: 'Divorce', points: 73, category: 'Famille' },
  { id: '3', event_text: 'Séparation conjugale', points: 65, category: 'Famille' },
  { id: '4', event_text: 'Décès d\'un membre proche de la famille', points: 63, category: 'Famille' },
  { id: '5', event_text: 'Mariage', points: 50, category: 'Famille' },
  { id: '6', event_text: 'Réconciliation avec le conjoint(e)', points: 45, category: 'Famille' },
  { id: '7', event_text: 'Arrivée d\'un nouveau membre dans la famille', points: 39, category: 'Famille' },
  { id: '8', event_text: 'Changement dans la santé d\'un membre de la famille', points: 44, category: 'Famille' },
  { id: '9', event_text: 'Grossesse', points: 40, category: 'Famille' },
  { id: '10', event_text: 'Difficultés sexuelles', points: 39, category: 'Famille' },
  // Travail
  { id: '11', event_text: 'Licenciement', points: 47, category: 'Travail' },
  { id: '12', event_text: 'Retraite', points: 45, category: 'Travail' },
  { id: '13', event_text: 'Changement de situation professionnelle', points: 39, category: 'Travail' },
  { id: '14', event_text: 'Modification des responsabilités au travail', points: 29, category: 'Travail' },
  { id: '15', event_text: 'Problèmes avec le supérieur hiérarchique', points: 23, category: 'Travail' },
  { id: '16', event_text: 'Changement des conditions de travail', points: 20, category: 'Travail' },
  // Santé
  { id: '17', event_text: 'Blessure ou maladie personnelle', points: 53, category: 'Santé' },
  { id: '18', event_text: 'Début ou arrêt de l\'emploi du conjoint(e)', points: 26, category: 'Santé' },
  // Finances
  { id: '19', event_text: 'Importante dégradation financière', points: 38, category: 'Finances' },
  { id: '20', event_text: 'Remboursement d\'une dette ou d\'un prêt', points: 30, category: 'Finances' },
  { id: '21', event_text: 'Emprunt de moins de 10 000€', points: 17, category: 'Finances' },
  { id: '22', event_text: 'Saisie d\'hypothèque ou de prêt', points: 30, category: 'Finances' },
  // Social
  { id: '23', event_text: 'Décès d\'un ami proche', points: 37, category: 'Social' },
  { id: '24', event_text: 'Changement de relations amicales', points: 26, category: 'Social' },
  // Logement
  { id: '25', event_text: 'Déménagement', points: 20, category: 'Logement' },
  { id: '26', event_text: 'Changement dans les conditions de logement', points: 25, category: 'Logement' },
  // Autre
  { id: '27', event_text: 'Infraction mineure à la loi', points: 11, category: 'Autre' },
  { id: '28', event_text: 'Emprisonnement', points: 63, category: 'Autre' },
  { id: '29', event_text: 'Vacances', points: 13, category: 'Autre' },
  { id: '30', event_text: 'Fêtes de Noël / fin d\'année', points: 12, category: 'Autre' },
];

const DiagnosticPage = () => {
  const navigate = useNavigate();
  const { decoded } = useAuth();

  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [notification, setNotification] = useState('');

  const categories = [...new Set(STRESS_EVENTS.map(e => e.category))];
  const filteredEvents = currentCategory
    ? STRESS_EVENTS.filter(e => e.category === currentCategory)
    : STRESS_EVENTS;

  const totalScore = STRESS_EVENTS
    .filter(e => selectedEvents.has(e.id))
    .reduce((sum, e) => sum + e.points, 0);

  const toggleEvent = (id: string) => {
    const next = new Set(selectedEvents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEvents(next);
  };

  const getStressLevel = (score: number) => {
    if (score < 150) return {
      level: 'Faible', emoji: '✅',
      colorClass: 'text-green-700 bg-green-50 border-green-200',
      description: 'Risque faible de stress. Continuez à maintenir un bon équilibre de vie.',
    };
    if (score < 300) return {
      level: 'Modéré', emoji: '⚠️',
      colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      description: 'Risque modéré. Prenez soin de vous et adoptez des techniques de relaxation.',
    };
    return {
      level: 'Élevé', emoji: '🔴',
      colorClass: 'text-red-700 bg-red-50 border-red-200',
      description: 'Risque élevé. Il est recommandé de consulter un professionnel et de pratiquer régulièrement des activités de détente.',
    };
  };

  const handleSubmit = async () => {
    const selectedList = STRESS_EVENTS
      .filter(e => selectedEvents.has(e.id))
      .map(e => ({ id: e.id, text: e.event_text, points: e.points }));

    if (decoded) {
      setSubmitting(true);
      try {
        await fetch(`${API}/stress`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ total_score: totalScore, selected_events: selectedList }),
        });
      } catch (err) { console.error(err); }
      setSubmitting(false);
    }
    setShowResults(true);
  };

  const stressResult = getStressLevel(totalScore);
  const progressValue = Math.min((totalScore / 300) * 100, 100);

  if (showResults) {
    return (
      <div className="min-h-screen soft-bg">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
          <div className="calm-card p-8 text-center animate-scale-in">
            <div className="text-5xl mb-4">{stressResult.emoji}</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Résultats de votre évaluation</h1>
            <p className="text-gray-400 mb-8 text-sm">Basé sur l'échelle de stress de Holmes-Rahe</p>

            <div className="text-6xl font-bold gradient-text mb-1">{totalScore}</div>
            <p className="text-gray-400 mb-6">points de stress</p>

            <div className={`p-4 rounded-2xl border mb-6 ${stressResult.colorClass}`}>
              <p className="font-semibold mb-1">Niveau de stress : {stressResult.level}</p>
              <p className="text-sm">{stressResult.description}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 text-left mb-8 text-sm text-gray-500 space-y-1">
              <p className="font-medium text-gray-700 mb-2">Échelle de référence :</p>
              <p>✅ Moins de 150 points — Risque faible</p>
              <p>⚠️ 150 à 299 points — Risque modéré</p>
              <p>🔴 300 points et plus — Risque élevé</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedEvents(new Set()); setShowResults(false); setCurrentCategory(null); }}
                className="btn-outline flex-1"
              >
                Refaire le test
              </button>
              <button onClick={() => navigate('/respiration')} className="btn-primary flex-1">
                🌬️ Respirer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="btn-ghost text-sm mb-4 flex items-center gap-1">
            ← Retour
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧠</span>
            <h1 className="text-3xl font-bold text-gray-800">Diagnostic de stress</h1>
          </div>
          <p className="text-gray-500">
            Sélectionnez les événements que vous avez vécus au cours des 12 derniers mois
          </p>
        </div>

        {/* Score progress */}
        <div className="calm-card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{selectedEvents.size} événement(s) sélectionné(s)</span>
            <span className="font-semibold gradient-text text-lg">{totalScore} pts</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCurrentCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              currentCategory === null
                ? 'bg-purple-500 text-white border-purple-500'
                : 'border-purple-200 text-purple-600 hover:bg-purple-50'
            }`}
          >
            Tous ({STRESS_EVENTS.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCurrentCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                currentCategory === cat
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'border-purple-200 text-purple-600 hover:bg-purple-50'
              }`}
            >
              {cat} ({STRESS_EVENTS.filter(e => e.category === cat).length})
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="space-y-3 mb-8">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className={`calm-card p-4 cursor-pointer transition-all hover:shadow-glow ${
                selectedEvents.has(event.id)
                  ? 'ring-2 ring-purple-400 bg-purple-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleEvent(event.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedEvents.has(event.id)
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-gray-300'
                }`}>
                  {selectedEvents.has(event.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{event.event_text}</p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {event.category}
                  </span>
                </div>
                <span className="text-lg font-semibold gradient-text flex-shrink-0">
                  {event.points} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || selectedEvents.size === 0}
            className="btn-primary text-base py-3 px-10 inline-flex items-center gap-2"
          >
            {submitting ? '⏳ Sauvegarde...' : '→ Voir mes résultats'}
          </button>
          {!decoded && (
            <p className="text-sm text-gray-400">
              <button onClick={() => navigate('/connexion')} className="text-purple-600 hover:underline">
                Connectez-vous
              </button>{' '}
              pour sauvegarder vos résultats
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
