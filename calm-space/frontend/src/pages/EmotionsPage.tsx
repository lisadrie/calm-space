import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartBarIcon, TrashIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';
import { useAuth, API_URL } from '../hooks/useAuth';
import { EMOTIONS_CONFIG } from '../constants/emotions';
import { format, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { decoded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (decoded) loadEmotions();
    else setLogs([]);
  }, [decoded]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadEmotions = async () => {
    try {
      const res = await fetch(`${API_URL}/emotions`, { credentials: 'include' });
      if (res.ok) setLogs(await res.json());
      else notify("Impossible de charger l'historique.", 'error');
    } catch {
      notify('Erreur de connexion au serveur.', 'error');
    }
  };

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 2800);
  };

  const handleEmotionSelect = async (emotionId: string) => {
    if (!decoded) { navigate('/connexion'); return; }
    setSelectedEmotion(emotionId);
    setLoading(true);
    const config = EMOTIONS_CONFIG.find(e => e.id === emotionId);
    if (!config) { setLoading(false); return; }
    try {
      const res = await fetch(`${API_URL}/emotions`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion: emotionId, emoji: config.emoji, color: config.color }),
      });
      if (res.ok) {
        const newLog = await res.json();
        setLogs(prev => [newLog, ...prev]);
        notify('Émotion enregistrée !');
      } else {
        notify("Erreur lors de l'enregistrement.", 'error');
      }
    } catch {
      notify('Erreur de connexion au serveur.', 'error');
    }
    setLoading(false);
    setTimeout(() => setSelectedEmotion(null), 800);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/emotions/${id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (res.ok) {
        setLogs(prev => prev.filter(l => l.id !== id));
        notify('Émotion supprimée.');
      } else {
        notify('Impossible de supprimer cette émotion.', 'error');
      }
    } catch {
      notify('Erreur de connexion au serveur.', 'error');
    }
  };

  const today = new Date();
  const todayLogs = logs.filter(l => isSameDay(parseISO(l.logged_at), today));

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
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl font-medium text-sm animate-fade-in border shadow-glow ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-white border-purple-200 text-purple-700'
        }`}>
          {notification.text}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Suivi des Émotions</h1>
          <p className="text-gray-500 text-lg">Comment te sens-tu en ce moment ?</p>
        </div>

        {!decoded && (
          <div className="calm-card p-4 mb-6 flex items-center justify-between animate-fade-in">
            <p className="text-sm text-gray-500">Connecte-toi pour enregistrer tes émotions</p>
            <button onClick={() => navigate('/connexion')} className="btn-primary text-sm py-1.5 px-4">Connexion</button>
          </div>
        )}

        {/* Emotion grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {EMOTIONS_CONFIG.map((emotion) => {
            const isSelected = selectedEmotion === emotion.id;
            return (
              <button
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion.id)}
                disabled={loading || !decoded}
                className={`calm-card p-5 transition-all hover:scale-105 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed text-center ${
                  isSelected ? 'scale-110 shadow-glow ring-2 ring-purple-300' : ''
                }`}
              >
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${emotion.color} flex items-center justify-center text-2xl`}>
                  {emotion.emoji}
                </div>
                <p className="font-medium text-gray-700 text-sm">{emotion.label}</p>
              </button>
            );
          })}
        </div>

        {/* Today */}
        {decoded && todayLogs.length > 0 && (
          <div className="calm-card p-6 mb-6 animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aujourd'hui — {format(today, 'd MMMM', { locale: fr })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {todayLogs.map(log => {
                const cfg = EMOTIONS_CONFIG.find(e => e.id === log.emotion);
                return cfg ? (
                  <span key={log.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${cfg.bg}`}>
                    {cfg.emoji} {cfg.label}
                    <span className="text-xs text-gray-400 ml-1">{format(parseISO(log.logged_at), 'HH:mm')}</span>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* 7-day activity */}
        {decoded && logs.length > 0 && (
          <div className="calm-card p-6 mb-6 animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-purple-500" />
              Activité — 7 derniers jours
            </h2>
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

        {/* History */}
        {decoded && logs.length > 0 && (
          <div className="calm-card p-6 animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Historique récent</h2>
            <div className="space-y-2">
              {logs.slice(0, 10).map((log) => {
                const cfg = EMOTIONS_CONFIG.find(e => e.id === log.emotion);
                if (!cfg) return null;
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center text-xl flex-shrink-0`}>
                      {cfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-700">{cfg.label}</p>
                      <p className="text-xs text-gray-400">{format(parseISO(log.logged_at), "d MMM 'à' HH:mm", { locale: fr })}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                      aria-label="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {decoded && logs.length === 0 && (
          <div className="text-center mt-4 py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 flex items-center justify-center">
              <FaceSmileIcon className="w-8 h-8 text-purple-300" />
            </div>
            <p className="text-gray-400">Sélectionne une émotion ci-dessus pour commencer</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmotionsPage;
