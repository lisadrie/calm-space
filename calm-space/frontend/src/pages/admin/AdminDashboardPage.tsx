import { useEffect, useState } from 'react';
import {
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { API_URL } from '../../hooks/useAuth';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalEmotions: number;
  totalStress: number;
  newUsersWeek: number;
}

interface Activity {
  dailyRegistrations: { day: string; count: number }[];
  dailyEmotions:      { day: string; count: number }[];
  emotionBreakdown:   { emotion: string; count: number }[];
  rolesBreakdown:     { role: string; count: number }[];
}

const ROLE_COLORS: Record<string, string> = {
  'Super Admin': '#7c3aed',
  'Admin':       '#2563eb',
  'Modérateur':  '#0891b2',
  'Utilisateur': '#d1d5db',
};

const EMOTION_COLORS = [
  '#a78bfa', '#60a5fa', '#34d399', '#fbbf24',
  '#f87171', '#fb923c', '#e879f9', '#94a3b8',
];

const KPI_CONFIG = [
  { key: 'totalUsers',    label: 'Utilisateurs',         Icon: UsersIcon,                color: 'text-purple-600', bg: 'bg-purple-50'  },
  { key: 'activeUsers',   label: 'Comptes actifs',        Icon: CheckCircleIcon,          color: 'text-emerald-600',bg: 'bg-emerald-50' },
  { key: 'inactiveUsers', label: 'Comptes désactivés',    Icon: XCircleIcon,              color: 'text-red-500',    bg: 'bg-red-50'     },
  { key: 'newUsersWeek',  label: 'Nouveaux cette semaine',Icon: SparklesIcon,             color: 'text-cyan-600',   bg: 'bg-cyan-50'    },
  { key: 'totalEmotions', label: 'Émotions enregistrées', Icon: HeartIcon,                color: 'text-pink-600',   bg: 'bg-pink-50'    },
  { key: 'totalStress',   label: 'Diagnostics réalisés',  Icon: ClipboardDocumentListIcon,color: 'text-orange-600', bg: 'bg-orange-50'  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="font-medium text-gray-700">{payload[0].name}</p>
      <p className="text-purple-600 font-bold">{payload[0].value}</p>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError]       = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [resStats, resActivity] = await Promise.all([
          fetch(`${API_URL}/admin/stats`,    { credentials: 'include' }),
          fetch(`${API_URL}/admin/activity`, { credentials: 'include' }),
        ]);
        if (!resStats.ok || !resActivity.ok) {
          const status = !resStats.ok ? resStats.status : resActivity.status;
          setError(status === 401 ? 'Accès refusé — reconnectez-vous.' : `Erreur serveur (${status}).`);
          return;
        }
        const [s, a] = await Promise.all([resStats.json(), resActivity.json()]);
        setStats(s);
        setActivity(a);
      } catch {
        setError('Impossible de joindre le serveur.');
      }
    };
    load();
  }, []);

  const mergedDaily = (() => {
    if (!activity) return [];
    const regs = activity.dailyRegistrations ?? [];
    const emos = activity.dailyEmotions ?? [];
    const map: Record<string, { day: string; inscriptions: number; émotions: number }> = {};
    regs.forEach(({ day, count }) => {
      map[day] = { day, inscriptions: count, émotions: 0 };
    });
    emos.forEach(({ day, count }) => {
      if (map[day]) map[day].émotions = count;
      else map[day] = { day, inscriptions: 0, émotions: count };
    });
    return Object.values(map).sort((a, b) => {
      const [da, ma] = a.day.split('/').map(Number);
      const [db, mb] = b.day.split('/').map(Number);
      return ma !== mb ? ma - mb : da - db;
    });
  })();

  const activePct = stats && stats.totalUsers
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
    : 0;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (!stats || !activity) {
    return (
      <div className="p-8 flex items-center gap-3 text-gray-400 text-sm">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
        Chargement…
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la plateforme Calm Space</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {KPI_CONFIG.map(({ key, label, Icon, color, bg }) => {
          const value = stats[key as keyof Stats];
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{value.toLocaleString('fr-FR')}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donuts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Donut — Statut des comptes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Statut des comptes</h2>
          <p className="text-xs text-gray-400 mb-4">Actifs vs désactivés</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Actifs',     value: stats.activeUsers   },
                    { name: 'Désactivés', value: stats.inactiveUsers },
                  ]}
                  cx="50%" cy="50%"
                  innerRadius={62} outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90} endAngle={-270}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f87171" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-2xl font-bold text-gray-800">{activePct}%</span>
              <span className="text-xs text-gray-400">actifs</span>
            </div>
          </div>
        </div>

        {/* Donut — Répartition des rôles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Répartition des rôles</h2>
          <p className="text-xs text-gray-400 mb-4">{stats.totalUsers} compte{stats.totalUsers !== 1 ? 's' : ''} au total</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={(activity.rolesBreakdown ?? []).filter(r => r.count > 0)}
                  cx="50%" cy="50%"
                  innerRadius={62} outerRadius={88}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="role"
                  startAngle={90} endAngle={-270}
                >
                  {(activity.rolesBreakdown ?? [])
                    .filter(r => r.count > 0)
                    .map(({ role }) => (
                      <Cell key={role} fill={ROLE_COLORS[role]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-2xl font-bold text-gray-800">{stats.totalUsers}</span>
              <span className="text-xs text-gray-400">comptes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart — Activité 14 jours */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-1">Activité des 14 derniers jours</h2>
        <p className="text-xs text-gray-400 mb-6">Nouvelles inscriptions et émotions enregistrées par jour</p>
        {mergedDaily.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">Aucune activité sur cette période.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mergedDaily} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 4 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="inscriptions" name="Inscriptions" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="émotions"     name="Émotions"     fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar chart horizontal — Top émotions */}
      {(activity.emotionBreakdown ?? []).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Émotions les plus ressenties</h2>
          <p className="text-xs text-gray-400 mb-6">Classement sur l'ensemble de la plateforme</p>
          <ResponsiveContainer width="100%" height={(activity.emotionBreakdown ?? []).length * 44 + 20}>
            <BarChart
              data={activity.emotionBreakdown ?? []}
              layout="vertical"
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="emotion" tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="count" name="Occurrences" radius={[0, 4, 4, 0]}>
                {(activity.emotionBreakdown ?? []).map((_, i) => (
                  <Cell key={i} fill={EMOTION_COLORS[i % EMOTION_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
