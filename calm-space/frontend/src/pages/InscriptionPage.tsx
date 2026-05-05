import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const InscriptionPage = () => {
  const { message, error, Signup } = useAuth();
  const [form, setForm] = useState({
    civility: 'Monsieur',
    lastname: '',
    firstname: '',
    email: '',
    phone: '',
    birthdate: '',
    city: '',
    postcode: '',
    pseudo: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Signup(
      form.civility, form.lastname, form.firstname, form.email,
      form.phone, form.birthdate, form.city, form.postcode,
      form.pseudo, form.password, form.confirm_password
    );
  };

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))', boxShadow: '0 0 40px rgba(147,89,210,0.3)' }}
          >
            🌱
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Bienvenue</h1>
          <p className="text-gray-500">Crée ton compte pour commencer ton parcours bien-être</p>
        </div>

        <div className="calm-card p-8 animate-scale-in">
          {message && (
            <div className="mb-5 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl flex items-start gap-3">
              <span className="text-red-500 font-bold">✕</span>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Civilité */}
            <div>
              <label htmlFor="civility" className="label-text">Civilité *</label>
              <select
                id="civility"
                name="civility"
                value={form.civility}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="Monsieur">Monsieur</option>
                <option value="Madame">Madame</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Nom / Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastname" className="label-text">Nom *</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  placeholder="DUPONT"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="firstname" className="label-text">Prénom *</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  placeholder="Marie"
                  className="input-field"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label-text">Adresse e-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="marie@email.com"
                className="input-field"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="label-text">
                Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0612345678"
                className="input-field"
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="birthdate" className="label-text">Date de naissance *</label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            {/* Ville / Code postal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="label-text">Ville *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Paris"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="postcode" className="label-text">Code postal *</label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={form.postcode}
                  onChange={handleChange}
                  required
                  placeholder="75001"
                  className="input-field"
                />
              </div>
            </div>

            {/* Pseudo */}
            <div>
              <label htmlFor="pseudo" className="label-text">Pseudo *</label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                value={form.pseudo}
                onChange={handleChange}
                required
                placeholder="mon_pseudo"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">3 à 100 caractères, lettres, chiffres, - et _</p>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="label-text">Mot de passe *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">6 à 16 caractères, doit contenir un chiffre et un caractère spécial (!@#$%^&*)</p>
            </div>

            {/* Confirmation */}
            <div>
              <label htmlFor="confirm_password" className="label-text">Confirmer le mot de passe *</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary w-full text-base py-3">
              Créer mon compte
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-purple-600 hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InscriptionPage;
