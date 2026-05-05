import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth, API } from '../hooks/useAuth';
import { format, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const emotionsConfig = [
  { id: 'happy', label: 'Heureux', emoji: '😊', color: 'from-yellow-400 to-orange-400', bg: 'bg-yellow-50 border-yellow-200' },
  { id: 'calm', label: 'Calme', emoji: '😌', color: 'from-blue-400 to-cyan-400', bg: 'bg-blue-50 border-blue-200' },
  { id: 'neutral', label: 'Neutre', emoji: '😐', color: 'from-gray-400 to-slate-400', bg: 'bg-gray-50 border-gray-200' },
  { id: 'anxious', label: 'Anxieux', emoji: '😰', color: 'from-purple-400 to-pink-400', bg: 'bg-purple-50 border-purple-200' },
  { id: 'sad', label: 'Triste', emoji: '😢', color: 'from-indigo-400 to-blue-500', bg: 'bg-indigo-50 border-indigo-200' },
  { id: 'loved', label: 'Aimé', emoji: '🥰', color: 'from-pink-400 to-rose-400', bg: 'bg-pink-50 border-pink-200' },
];

interface EmotionLog {
  id: number;
  emotion: string;
  emoji: string;
  color: string;
  logged_at: string;
}

const EmotionsPage = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const { decoded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (decoded) loadEmotions();
    else setLogs([]);
  }, [decoded]);

  const loadEmotions = async () => {
    try {
      const res = await fetch(`${API}/emotions`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) { console.error(err); }
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  const handleEmotionSelect = async (emotionId: string) => {
    if (!decoded) { navigate('/connexion'); return; }

    setSelectedEmotion(emotionId);
    setLoading(true);

    const config = emotionsConfig.find(e => e.id === emotionId);
    if (!config) return;

    try {
      const res = await fetch(`${API}/emotions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion: emotionId, emoji: config.emoji, color: config.color }),
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(prev => [data, ...prev]);
        notify('Émotion enregistrée ! ✨');
      }
    } catch (err) { console.error(err); }

    setLoading(false);
    setTimeout(() => setSelectedEmotion(null), 800);
  };

  // Group logs by day for the history
  const today = new Date();
  const todayLogs = logs.filter(l => isSameDay(parseISO(l.logged_at), today));

  // Stats: last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: format(d, 'EEE', { locale: fr }),
      date: d,
      count: logs.filter(l => isSameDay(parseISO(l.logged_at), d)).length,
    };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-purple-200 shadow-glow px-5 py-3 rounded-2xl text-purple-700 font-medium text-sm animate-fade-in">
          {notification}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Suivi des Émotions
          </h1>
          <p className="text-gray-500 text-lg">Comment te sens-tu en ce moment ?</p>
        </div>

        {!decoded && (
          <div className="calm-card p-4 mb-6 flex items-center justify-between animate-fade-in">
            <p className="text-sm text-gray-500">Connecte-toi pour enregistrer tes émotions</p>
            <button onClick={() => navigate('/connexion')} className="btn-primary text-sm py-1.5 px-4">
              Connexion
            </button>
          </div>
        )}

        {/* Emotion grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {emotionsConfig.map((emotion) => {
            const isSelected = selectedEmotion === emotion.id;
            return (
              <button
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion.id)}
                disabled={loading || !decoded}
                className={`calm-card p-6 transition-all hover:scale-105 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed text-center ${
                  isSelected ? 'scale-110 shadow-glow ring-2 ring-purple-300' : ''
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${emotion.color} flex items-center justify-center text-3xl`}
                >
                  {emotion.emoji}
                </div>
                <p className="font-medium text-gray-700">{emotion.label}</p>
              </button>
            );
          })}
        </div>

        {/* Today's emotions */}
        {decoded && todayLogs.length > 0 && (
          <div className="calm-card p-6 mb-6 animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aujourd'hui — {format(today, 'd MMMM', { locale: fr })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {todayLogs.map(log => {
                const cfg = emotionsConfig.find(e => e.id === log.emotion);
                return cfg ? (
                  <span
                    key={log.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${cfg.bg}`}
                  >
                    {cfg.emoji} {cfg.label}
                    <span className="text-xs text-gray-400 ml-1">
                      {format(parseISO(log.logged_at), 'HH:mm')}
                    </span>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* 7-day activity */}
        {decoded && logs.length > 0 && (
          <div className="calm-card p-6 animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Activité — 7 derniers jours</h2>
            <div className="flex items-end gap-2 h-20">
              {last7Days.map((day) => (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-400 to-cyan-400 transition-all"
                    style={{ height: `${(day.count / maxCount) * 64}px`, minHeight: day.count > 0 ? '8px' : '2px', opacity: day.count > 0 ? 1 : 0.2 }}
                  />
                  <span className="text-xs text-gray-400 capitalize">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent history */}
        {decoded && logs.length > 0 && (
          <div className="calm-card p-6 mt-6 animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Check-ins récents</h2>
            <div className="space-y-3">
              {logs.slice(0, 8).map((log) => {
                const cfg = emotionsConfig.find(e => e.id === log.emotion);
                if (!cfg) return null;
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center text-xl flex-shrink-0`}>
                      {cfg.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{cfg.label}</p>
                      <p className="text-xs text-gray-400">
                        {format(parseISO(log.logged_at), "d MMM 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {decoded && logs.length === 0 && (
          <p className="text-center text-gray-400 mt-4">
            Sélectionne une émotion ci-dessus pour commencer 🌱
          </p>
        )}
      </main>
    </div>
  );
};

export default EmotionsPage;
