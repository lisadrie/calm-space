import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon, TrashIcon, FaceSmileIcon,
  FireIcon, CalendarDaysIcon, HeartIcon,
  ArrowTrendingUpIcon, ClockIcon, SparklesIcon,
  SunIcon, MoonIcon, StarIcon,
} from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';
import { useAuth, API_URL } from '../hooks/useAuth';
import { EMOTIONS_CONFIG } from '../constants/emotions';
import { format, isSameDay, parseISO, subDays, addDays, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmotionLog {
  id: number;
  emotion: string;
  emoji: string;
  color: string;
  logged_at: string;
}

const VALENCE: Record<string, 'pos' | 'neu' | 'neg'> = {
  happy: 'pos', calm: 'pos', loved: 'pos',
  neutral: 'neu',
  anxious: 'neg', sad: 'neg', angry: 'neg', tired: 'neg',
};

const computeStreak = (logs: EmotionLog[]): number => {
  if (!logs.length) return 0;
  const days = new Set(logs.map(l => format(parseISO(l.logged_at), 'yyyy-MM-dd')));
  let streak = 0;
  let d = new Date();
  if (!days.has(format(d, 'yyyy-MM-dd'))) d = subDays(d, 1);
  while (days.has(format(d, 'yyyy-MM-dd'))) { streak++; d = subDays(d, 1); }
  return streak;
};

type IconComp = React.ComponentType<{ className?: string }>;

const EmotionsPage = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'log' | 'stats'>('log');
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
      const res = await fetch(`${API_URL}/emotions/${id}`, { method: 'DELETE', credentials: 'include' });
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

  // ── Stats ──────────────────────────────────────────────
  const today = new Date();
  const todayLogs = logs.filter(l => isSameDay(parseISO(l.logged_at), today));
  const totalLogs = logs.length;
  const activeDays = new Set(logs.map(l => format(parseISO(l.logged_at), 'yyyy-MM-dd'))).size;
  const streak = computeStreak(logs);

  const emotionStats = EMOTIONS_CONFIG
    .map(e => ({
      ...e,
      count: logs.filter(l => l.emotion === e.id).length,
      pct: totalLogs > 0 ? Math.round((logs.filter(l => l.emotion === e.id).length / totalLogs) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const topEmotion = emotionStats.find(e => e.count > 0) ?? null;
  const posCount = logs.filter(l => VALENCE[l.emotion] === 'pos').length;
  const negCount = logs.filter(l => VALENCE[l.emotion] === 'neg').length;
  const neuCount = logs.filter(l => VALENCE[l.emotion] === 'neu').length;
  const wellnessScore = totalLogs > 0 ? Math.round((posCount / totalLogs) * 100) : 0;

  // Heatmap: 28 days aligned to Mon–Sun
  const todayDow = (getDay(today) + 6) % 7; // Mon=0 … Sun=6
  const heatStart = subDays(today, todayDow + 21);
  const heatmapCells = Array.from({ length: 28 }, (_, i) => {
    const d = addDays(heatStart, i);
    const isFuture = d > today;
    const dateStr = format(d, 'yyyy-MM-dd');
    return {
      dateStr,
      label: format(d, 'EEEE d MMM', { locale: fr }),
      count: isFuture ? -1 : logs.filter(l => format(parseISO(l.logged_at), 'yyyy-MM-dd') === dateStr).length,
      isFuture,
    };
  });

  const heatColor = (count: number, isFuture: boolean) => {
    if (isFuture) return 'bg-transparent cursor-default';
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-purple-200';
    if (count <= 3) return 'bg-purple-400';
    return 'bg-purple-600';
  };

  // Time of day
  const TIME_DEFS: { label: string; sub: string; Icon: IconComp; color: string; test: (h: number) => boolean }[] = [
    { label: 'Matin',       sub: '6h–12h',  Icon: SunIcon,      color: 'from-yellow-400 to-orange-300', test: h => h >= 6 && h < 12 },
    { label: 'Après-midi',  sub: '12h–18h', Icon: SunIcon,      color: 'from-orange-400 to-amber-300',  test: h => h >= 12 && h < 18 },
    { label: 'Soir',        sub: '18h–23h', Icon: MoonIcon,     color: 'from-violet-400 to-purple-400', test: h => h >= 18 && h < 23 },
    { label: 'Nuit',        sub: '23h–6h',  Icon: StarIcon,     color: 'from-slate-500 to-slate-400',   test: h => h >= 23 || h < 6 },
  ];
  const timePeriods = TIME_DEFS.map(p => ({
    ...p,
    count: logs.filter(l => p.test(parseISO(l.logged_at).getHours())).length,
  }));
  const maxTimeCount = Math.max(...timePeriods.map(p => p.count), 1);

  // Days of week
  const FR_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayStats = FR_DAYS.map((name, i) => ({
    name,
    count: logs.filter(l => getDay(parseISO(l.logged_at)) === (i + 1) % 7).length,
  }));
  const maxDayCount = Math.max(...dayStats.map(d => d.count), 1);

  const hasStats = decoded && totalLogs > 0;

  const KPI = [
    { label: 'Entrées totales', value: String(totalLogs), Icon: HeartIcon as IconComp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Jours actifs',    value: String(activeDays), Icon: CalendarDaysIcon as IconComp, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Série actuelle',  value: `${streak}j`,       Icon: FireIcon as IconComp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Émotion phare',   value: topEmotion?.label ?? '–', Icon: SparklesIcon as IconComp, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      {notification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl font-medium text-sm animate-fade-in border shadow-glow ${
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-purple-200 text-purple-700'
        }`}>
          {notification.text}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Suivi des Émotions</h1>
          <p className="text-gray-500 text-lg">Comment te sens-tu en ce moment ?</p>
        </div>

        {!decoded && (
          <div className="calm-card p-4 mb-6 flex items-center justify-between animate-fade-in">
            <p className="text-sm text-gray-500">Connecte-toi pour enregistrer tes émotions</p>
            <button onClick={() => navigate('/connexion')} className="btn-primary text-sm py-1.5 px-4">Connexion</button>
          </div>
        )}

        {/* Tabs */}
        {decoded && (
          <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-2xl w-fit mx-auto">
            <button
              onClick={() => setTab('log')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === 'log' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaceSmileIcon className="w-4 h-4" /> Saisir
            </button>
            <button
              onClick={() => setTab('stats')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === 'stats' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ChartBarIcon className="w-4 h-4" /> Statistiques
              {totalLogs > 0 && (
                <span className="bg-purple-100 text-purple-600 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                  {totalLogs}
                </span>
              )}
            </button>
          </div>
        )}

        {/* ── SAISIE ─────────────────────────────────────────── */}
        {(!decoded || tab === 'log') && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {EMOTIONS_CONFIG.map(emotion => (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionSelect(emotion.id)}
                  disabled={loading || !decoded}
                  className={`calm-card p-5 transition-all hover:scale-105 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed text-center ${
                    selectedEmotion === emotion.id ? 'scale-110 shadow-glow ring-2 ring-purple-300' : ''
                  }`}
                >
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${emotion.color} flex items-center justify-center text-2xl`}>
                    {emotion.emoji}
                  </div>
                  <p className="font-medium text-gray-700 text-sm">{emotion.label}</p>
                </button>
              ))}
            </div>

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

            {decoded && logs.length > 0 && (
              <div className="calm-card p-6 animate-scale-in">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Historique récent</h2>
                <div className="space-y-2">
                  {logs.slice(0, 10).map(log => {
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
          </>
        )}

        {/* ── STATISTIQUES ───────────────────────────────────── */}
        {decoded && tab === 'stats' && (
          <>
            {!hasStats ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <ChartBarIcon className="w-8 h-8 text-purple-300" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Pas encore de données</p>
                <p className="text-gray-400 text-sm mt-1">Commence à enregistrer tes émotions pour voir tes statistiques</p>
                <button onClick={() => setTab('log')} className="btn-primary mt-5 text-sm">
                  Saisir une émotion
                </button>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in">

                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {KPI.map(({ label, value, Icon, color, bg }) => (
                    <div key={label} className="calm-card p-4">
                      <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800 leading-none">{value}</p>
                      <p className="text-xs text-gray-400 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Score de bien-être */}
                <div className="calm-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <ArrowTrendingUpIcon className="w-5 h-5 text-purple-500" />
                        Score de bien-être
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">Proportion d'émotions positives sur le total</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-4xl font-bold leading-none ${
                        wellnessScore >= 60 ? 'text-emerald-500' : wellnessScore >= 40 ? 'text-yellow-500' : 'text-red-400'
                      }`}>
                        {wellnessScore}<span className="text-xl font-normal text-gray-300">%</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">positif</p>
                    </div>
                  </div>

                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                    {negCount > 0 && (
                      <div
                        className="h-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-700 rounded-l-full"
                        style={{ width: `${Math.round((negCount / totalLogs) * 100)}%` }}
                      />
                    )}
                    {neuCount > 0 && (
                      <div
                        className="h-full bg-gray-300 transition-all duration-700"
                        style={{ width: `${Math.round((neuCount / totalLogs) * 100)}%` }}
                      />
                    )}
                    {posCount > 0 && (
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-700 rounded-r-full"
                        style={{ width: `${Math.round((posCount / totalLogs) * 100)}%` }}
                      />
                    )}
                  </div>

                  <div className="flex gap-5 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-400 to-orange-400 inline-block shrink-0" />
                      Négatif · {negCount} ({Math.round((negCount / totalLogs) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block shrink-0" />
                      Neutre · {neuCount} ({Math.round((neuCount / totalLogs) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 inline-block shrink-0" />
                      Positif · {posCount} ({Math.round((posCount / totalLogs) * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Répartition des émotions */}
                <div className="calm-card p-6">
                  <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-purple-500" />
                    Répartition des émotions
                  </h2>
                  <div className="space-y-3.5">
                    {emotionStats.filter(e => e.count > 0).map(e => (
                      <div key={e.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center text-base shrink-0`}>
                          {e.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-gray-700">{e.label}</span>
                            <span className="text-xs text-gray-400 tabular-nums">{e.count} entr{e.count > 1 ? 'ées' : 'ée'} · {e.pct}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${e.color} transition-all duration-700`}
                              style={{ width: `${e.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heatmap */}
                <div className="calm-card p-6">
                  <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-purple-500" />
                    Calendrier d'activité — 4 dernières semaines
                  </h2>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                      <div key={i} className="text-center text-xs text-gray-400 pb-1">{d}</div>
                    ))}
                    {heatmapCells.map((cell, i) => (
                      <div
                        key={i}
                        title={cell.isFuture ? '' : `${cell.label} · ${cell.count} entr${cell.count !== 1 ? 'ées' : 'ée'}`}
                        className={`aspect-square rounded-md transition-colors ${heatColor(cell.count, cell.isFuture)}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-gray-400">
                    <span>Moins</span>
                    <div className="w-3 h-3 rounded bg-gray-100" />
                    <div className="w-3 h-3 rounded bg-purple-200" />
                    <div className="w-3 h-3 rounded bg-purple-400" />
                    <div className="w-3 h-3 rounded bg-purple-600" />
                    <span>Plus</span>
                  </div>
                </div>

                {/* Moment de la journée + Jour de la semaine */}
                <div className="grid md:grid-cols-2 gap-5">

                  <div className="calm-card p-6">
                    <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-purple-500" />
                      Moment de la journée
                    </h2>
                    <div className="space-y-3">
                      {timePeriods.map(p => (
                        <div key={p.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1.5 text-sm text-gray-700">
                              <p.Icon className="w-4 h-4 text-gray-400" />
                              {p.label}
                              <span className="text-xs text-gray-400">{p.sub}</span>
                            </span>
                            <span className="text-sm font-semibold text-gray-600 tabular-nums">{p.count}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${p.color} transition-all duration-700`}
                              style={{ width: `${(p.count / maxTimeCount) * 100}%`, minWidth: p.count > 0 ? '6px' : '0' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="calm-card p-6">
                    <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <CalendarDaysIcon className="w-5 h-5 text-purple-500" />
                      Par jour de la semaine
                    </h2>
                    <div className="flex items-end gap-2 h-28">
                      {dayStats.map(day => (
                        <div key={day.name} className="flex-1 flex flex-col items-center gap-1">
                          {day.count > 0 && (
                            <span className="text-xs text-gray-500 tabular-nums">{day.count}</span>
                          )}
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-purple-400 to-cyan-400 transition-all duration-700"
                            style={{
                              height: `${(day.count / maxDayCount) * 80}px`,
                              minHeight: day.count > 0 ? '6px' : '2px',
                              opacity: day.count > 0 ? 1 : 0.2,
                            }}
                          />
                          <span className="text-xs text-gray-400">{day.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default EmotionsPage;
