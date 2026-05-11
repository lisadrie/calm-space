import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CloudIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';
import { useAuth, API_URL } from '../hooks/useAuth';
import { STRESS_EVENTS } from '../constants/stressEvents';

type StressLevel = {
  level: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  colorClass: string;
  description: string;
};

const getStressLevel = (score: number): StressLevel => {
  if (score < 150) return {
    level: 'Faible', Icon: CheckCircleIcon, iconClass: 'text-green-500',
    colorClass: 'text-green-700 bg-green-50 border-green-200',
    description: 'Risque faible de stress. Continuez à maintenir un bon équilibre de vie.',
  };
  if (score < 300) return {
    level: 'Modéré', Icon: ExclamationTriangleIcon, iconClass: 'text-yellow-500',
    colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    description: 'Risque modéré. Prenez soin de vous et adoptez des techniques de relaxation.',
  };
  return {
    level: 'Élevé', Icon: ExclamationCircleIcon, iconClass: 'text-red-500',
    colorClass: 'text-red-700 bg-red-50 border-red-200',
    description: 'Risque élevé. Il est recommandé de consulter un professionnel et de pratiquer régulièrement des activités de détente.',
  };
};

const DiagnosticPage = () => {
  const navigate = useNavigate();
  const { decoded } = useAuth();

  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);

  const categories = [...new Set(STRESS_EVENTS.map(e => e.category))];
  const filteredEvents = currentCategory
    ? STRESS_EVENTS.filter(e => e.category === currentCategory)
    : STRESS_EVENTS;

  const totalScore = STRESS_EVENTS
    .filter(e => selectedEvents.has(e.id))
    .reduce((sum, e) => sum + e.points, 0);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleEvent = (id: string) => {
    const next = new Set(selectedEvents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEvents(next);
  };

  const handleSubmit = async () => {
    const selectedList = STRESS_EVENTS
      .filter(e => selectedEvents.has(e.id))
      .map(e => ({ id: e.id, text: e.event_text, points: e.points }));

    if (decoded) {
      setSubmitting(true);
      try {
        const res = await fetch(`${API_URL}/stress`, {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ total_score: totalScore, selected_events: selectedList }),
        });
        if (res.ok) {
          setSavedScore(totalScore);
          setShowResults(true);
        } else {
          notify('Impossible de sauvegarder vos résultats. Veuillez réessayer.', 'error');
        }
      } catch {
        notify('Erreur de connexion au serveur.', 'error');
      }
      setSubmitting(false);
    } else {
      setShowResults(true);
    }
  };

  const stressResult = getStressLevel(totalScore);
  const progressValue = Math.min((totalScore / 300) * 100, 100);

  if (showResults) {
    const { Icon, iconClass, colorClass, level, description } = stressResult;
    return (
      <div className="min-h-screen soft-bg">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
          <div className="calm-card p-8 text-center animate-scale-in">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center`}>
              <Icon className={`w-9 h-9 ${iconClass}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Résultats de votre évaluation</h1>
            <p className="text-gray-400 mb-8 text-sm">Basé sur l'échelle de stress de Holmes-Rahe</p>

            <div className="text-6xl font-bold gradient-text mb-1">{totalScore}</div>
            <p className="text-gray-400 mb-6">points de stress</p>

            {decoded && savedScore !== null && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-3 text-sm font-medium flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Résultat sauvegardé dans votre historique
              </div>
            )}

            <div className={`p-4 rounded-2xl border mb-6 ${colorClass}`}>
              <p className="font-semibold mb-1">Niveau de stress : {level}</p>
              <p className="text-sm">{description}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 text-left mb-8 text-sm text-gray-500 space-y-2">
              <p className="font-medium text-gray-700 mb-3">Échelle de référence</p>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                <span>Moins de 150 points — Risque faible</span>
              </div>
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 shrink-0" />
                <span>150 à 299 points — Risque modéré</span>
              </div>
              <div className="flex items-center gap-2">
                <ExclamationCircleIcon className="w-4 h-4 text-red-500 shrink-0" />
                <span>300 points et plus — Risque élevé</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedEvents(new Set()); setShowResults(false); setCurrentCategory(null); setSavedScore(null); }}
                className="btn-outline flex-1 gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" /> Refaire le test
              </button>
              <button onClick={() => navigate('/respiration')} className="btn-primary flex-1 gap-2">
                <CloudIcon className="w-4 h-4" /> Respirer
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

      {notification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl font-medium text-sm animate-fade-in border shadow-glow ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-white border-purple-200 text-purple-700'
        }`}>
          {notification.text}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="btn-ghost text-sm mb-4 gap-1.5">
            <ArrowLeftIcon className="w-4 h-4" /> Retour
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
            </div>
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
                selectedEvents.has(event.id) ? 'ring-2 ring-purple-400 bg-purple-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleEvent(event.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedEvents.has(event.id) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
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
            className="btn-primary text-base py-3 px-10 gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sauvegarde…
              </>
            ) : 'Voir mes résultats'}
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
