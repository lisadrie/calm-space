import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';
import { useAuth, API_URL } from '../hooks/useAuth';

const ProfilePage = () => {
  const { decoded, logout, loading, error, setError, setMessage, message, refreshUser } = useAuth();
  const [form, setForm] = useState({
    civility:  decoded?.civility  || 'Monsieur',
    lastname:  decoded?.lastname  || '',
    firstname: decoded?.firstname || '',
    email:     decoded?.email     || '',
    phone:     decoded?.phone     || '',
    birthdate: decoded?.birthdate ? decoded.birthdate.split('T')[0] : '',
    city:      decoded?.city      || '',
    postcode:  decoded?.postcode  || '',
    pseudo:    decoded?.pseudo    || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/updateprofile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage('Profil mis à jour avec succès !');
        await refreshUser();
      } else {
        setError(json.message || json.error || 'Erreur lors de la mise à jour.');
      }
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen soft-bg">
        <Navigation />
        <div className="flex items-center justify-center pt-40">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-4 border-purple-300 border-t-purple-600 animate-spin" />
            <p className="text-gray-400 text-sm">Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!decoded) {
    return (
      <div className="min-h-screen soft-bg">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
          <div className="calm-card p-10 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-3">Mon Profil</h1>
            <p className="text-gray-500 mb-6">Connecte-toi pour accéder à ton profil et suivre ton parcours bien-être.</p>
            <Link to="/connexion">
              <button className="btn-primary text-base py-3 px-8">Se Connecter</button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Mon Profil</h1>
          <p className="text-gray-500">Gérez les paramètres de votre compte</p>
        </div>

        {/* User card */}
        <div className="calm-card p-6 mb-6 flex items-center gap-4 animate-scale-in">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))' }}
          >
            {decoded.pseudo.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{decoded.pseudo}</p>
            <p className="text-gray-400 text-sm">{decoded.role}</p>
            <p className="text-gray-400 text-sm">{decoded.email}</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="calm-card p-8 animate-scale-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Modifier mes informations</h2>

          {message && (
            <div className="mb-5 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl flex items-start gap-3">
              <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl flex items-start gap-3">
              <ExclamationCircleIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label htmlFor="civility" className="label-text">Civilité</label>
              <select id="civility" name="civility" value={form.civility} onChange={handleChange} className="input-field">
                <option value="Monsieur">Monsieur</option>
                <option value="Madame">Madame</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastname" className="label-text">Nom</label>
                <input type="text" id="lastname" name="lastname" value={form.lastname} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label htmlFor="firstname" className="label-text">Prénom</label>
                <input type="text" id="firstname" name="firstname" value={form.firstname} onChange={handleChange} required className="input-field" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label-text">Adresse e-mail</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" className="input-field" />
            </div>

            <div>
              <label htmlFor="phone" className="label-text">Téléphone <span className="text-gray-400 font-normal">(optionnel)</span></label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label htmlFor="birthdate" className="label-text">Date de naissance</label>
              <input type="date" id="birthdate" name="birthdate" value={form.birthdate} onChange={handleChange} required className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="label-text">Ville</label>
                <input type="text" id="city" name="city" value={form.city} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label htmlFor="postcode" className="label-text">Code postal</label>
                <input type="text" id="postcode" name="postcode" value={form.postcode} onChange={handleChange} required maxLength={5} className="input-field" />
              </div>
            </div>

            <div>
              <label htmlFor="pseudo" className="label-text">Pseudo</label>
              <input type="text" id="pseudo" name="pseudo" value={form.pseudo} onChange={handleChange} required className="input-field" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 text-base py-3">
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sauvegarde…
                  </>
                ) : 'Enregistrer les modifications'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="btn-outline py-3 px-5 gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
