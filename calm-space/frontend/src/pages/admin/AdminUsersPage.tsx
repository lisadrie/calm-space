import { useCallback, useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { API_URL, useAuth } from '../../hooks/useAuth';

interface AdminUser {
  id: number;
  civility: string;
  lastname: string;
  firstname: string;
  email: string;
  pseudo: string;
  phone: string | null;
  birthdate: string;
  city: string;
  postcode: string;
  active: boolean;
  created: string;
  updated: string;
  role: 'Super Admin' | 'Admin' | 'Modérateur' | 'Utilisateur';
}

const ROLE_STYLE: Record<string, string> = {
  'Super Admin': 'bg-purple-100 text-purple-700',
  'Admin':       'bg-blue-100 text-blue-700',
  'Modérateur':  'bg-cyan-100 text-cyan-700',
  'Utilisateur': 'bg-gray-100 text-gray-600',
};

const ASSIGNABLE_ROLES = ['Utilisateur', 'Modérateur', 'Admin'] as const;

const AdminUsersPage = () => {
  const { decoded } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch(`${API_URL}/admin/users`, { credentials: 'include' });
      if (res.ok) {
        setUsers(await res.json());
      } else {
        const json = await res.json().catch(() => ({}));
        setLoadError(json.message || `Erreur ${res.status} — impossible de charger les utilisateurs.`);
      }
    } catch {
      setLoadError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.pseudo.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.firstname.toLowerCase().includes(q) ||
      u.lastname.toLowerCase().includes(q)
    );
  });

  const flash = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const toggleActive = async (user: AdminUser) => {
    setActionError('');
    const endpoint = user.active ? 'deactive' : 'active';
    try {
      const res = await fetch(`${API_URL}/admin/users/${user.id}/${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
        flash(user.active ? `${user.pseudo} désactivé.` : `${user.pseudo} activé.`);
      } else {
        const json = await res.json().catch(() => ({}));
        setActionError(json.message || 'Erreur lors de la mise à jour.');
      }
    } catch {
      setActionError('Impossible de joindre le serveur.');
    }
  };

  const changeRole = async (user: AdminUser, role: string) => {
    setActionError('');
    try {
      const res = await fetch(`${API_URL}/admin/users/${user.id}/role`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: role as AdminUser['role'] } : u));
        flash(`Rôle de ${user.pseudo} mis à jour → ${role}.`);
      } else {
        const json = await res.json().catch(() => ({}));
        setActionError(json.message || 'Erreur lors du changement de rôle.');
      }
    } catch {
      setActionError('Impossible de joindre le serveur.');
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setActionError('');
    try {
      const res = await fetch(`${API_URL}/admin/users/${toDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== toDelete.id));
        flash(`Compte de ${toDelete.pseudo} supprimé.`);
        setToDelete(null);
      } else {
        const json = await res.json().catch(() => ({}));
        setActionError(json.message || 'Erreur lors de la suppression.');
        setToDelete(null);
      }
    } catch {
      setActionError('Impossible de joindre le serveur.');
      setToDelete(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} compte{users.length !== 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors shadow-sm">
          <ArrowPathIcon className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {loadError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
          <XCircleIcon className="w-4 h-4 shrink-0" />
          {loadError}
        </div>
      )}
      {actionError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{actionError}</div>
      )}
      {actionSuccess && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 shrink-0" />
          {actionSuccess}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par pseudo, e-mail, prénom ou nom…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center gap-3 p-8 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
            Chargement…
          </div>
        ) : loadError ? (
          <p className="p-8 text-center text-red-400 text-sm">Échec du chargement.</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['#', 'Pseudo', 'Nom & Prénom', 'E-mail', 'Rôle', 'Statut', 'Inscrit le', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(user => {
                  const isSelf = decoded?.id === user.id;
                  const isSuperAdmin = user.role === 'Super Admin';

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{user.id}</td>

                      <td className="px-4 py-3 font-medium text-gray-800">{user.pseudo}</td>

                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {user.civility} {user.firstname} {user.lastname}
                      </td>

                      <td className="px-4 py-3 text-gray-600">{user.email}</td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        {isSuperAdmin || isSelf ? (
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_STYLE[user.role]}`}>
                            {user.role}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={e => changeRole(user, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
                          >
                            {ASSIGNABLE_ROLES.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Active */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => !isSelf && toggleActive(user)}
                          disabled={isSelf}
                          title={isSelf ? 'Impossible de modifier votre propre compte' : user.active ? 'Désactiver' : 'Activer'}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            user.active
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-500 hover:bg-red-100'
                          } ${isSelf ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {user.active
                            ? <><CheckCircleIcon className="w-3.5 h-3.5" /> Actif</>
                            : <><XCircleIcon className="w-3.5 h-3.5" /> Inactif</>
                          }
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(user.created).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {!isSuperAdmin && !isSelf && (
                          <button
                            onClick={() => setToDelete(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Supprimer le compte"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Supprimer ce compte ?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Le compte de <strong>{toDelete.firstname} {toDelete.lastname}</strong> ({toDelete.pseudo}) sera définitivement supprimé. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
