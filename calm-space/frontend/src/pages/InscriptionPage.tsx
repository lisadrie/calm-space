import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const PSEUDO_REGEX = /^[a-zA-Z0-9_-]{3,100}$/;

const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
  if (!pwd) return { label: '', color: 'bg-gray-200', width: '0%' };
  const hasLength = pwd.length >= 6;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*]/.test(pwd);
  const score = [hasLength, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  if (score <= 1) return { label: 'Faible',    color: 'bg-red-400',    width: '25%'  };
  if (score === 2) return { label: 'Moyen',     color: 'bg-orange-400', width: '50%'  };
  if (score === 3) return { label: 'Bon',       color: 'bg-yellow-400', width: '75%'  };
  return              { label: 'Excellent', color: 'bg-green-500',  width: '100%' };
};

const InscriptionPage = () => {
  const { message, error, setError, Signup } = useAuth();
  const [form, setForm] = useState({
    civility: 'Monsieur', lastname: '', firstname: '', email: '',
    phone: '', birthdate: '', city: '', postcode: '', pseudo: '',
    password: '', confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    setError('');
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.pseudo.trim()) errs.pseudo = 'Le pseudo est obligatoire (ex : mon_pseudo).';
    else if (!PSEUDO_REGEX.test(form.pseudo)) errs.pseudo = 'Pseudo invalide : 3 à 100 caractères, lettres/chiffres/- et _ uniquement (pas de point ni @).';
    if (!EMAIL_REGEX.test(form.email)) errs.email = 'Adresse e-mail invalide.';
    if (!PASSWORD_REGEX.test(form.password)) errs.password = '6 à 16 caractères, 1 chiffre et 1 spécial (!@#$%^&*).';
    if (form.password !== form.confirm_password) errs.confirm_password = 'Les mots de passe ne correspondent pas.';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.focus();
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await Signup(
      form.civility, form.lastname, form.firstname, form.email,
      form.phone, form.birthdate, form.city, form.postcode,
      form.pseudo, form.password, form.confirm_password,
    );
    setSubmitting(false);
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))', boxShadow: '0 0 40px rgba(147,89,210,0.3)' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Bienvenue</h1>
          <p className="text-gray-500">Crée ton compte pour commencer ton parcours bien-être</p>
        </div>

        <div className="calm-card p-8 animate-scale-in">
          {message && (
            <div className="mb-5 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl flex items-start gap-3">
              <svg className="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl flex items-start gap-3">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="civility" className="label-text">Civilité *</label>
              <select id="civility" name="civility" value={form.civility} onChange={handleChange} required className="input-field">
                <option value="Monsieur">Monsieur</option>
                <option value="Madame">Madame</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastname" className="label-text">Nom *</label>
                <input type="text" id="lastname" name="lastname" value={form.lastname} onChange={handleChange} required placeholder="DUPONT" className="input-field" />
              </div>
              <div>
                <label htmlFor="firstname" className="label-text">Prénom *</label>
                <input type="text" id="firstname" name="firstname" value={form.firstname} onChange={handleChange} required placeholder="Marie" className="input-field" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label-text">Adresse e-mail *</label>
              <input
                type="email" id="email" name="email" value={form.email} onChange={handleChange}
                required autoComplete="email" placeholder="marie@email.com"
                className={`input-field ${fieldErrors.email ? 'border-red-400' : ''}`}
              />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="label-text">
                Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="0612345678" className="input-field" />
            </div>

            <div>
              <label htmlFor="birthdate" className="label-text">Date de naissance *</label>
              <input type="date" id="birthdate" name="birthdate" value={form.birthdate} onChange={handleChange} required className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="label-text">Ville *</label>
                <input type="text" id="city" name="city" value={form.city} onChange={handleChange} required placeholder="Paris" className="input-field" />
              </div>
              <div>
                <label htmlFor="postcode" className="label-text">Code postal *</label>
                <input type="text" id="postcode" name="postcode" value={form.postcode} onChange={handleChange} required placeholder="75001" maxLength={5} className="input-field" />
              </div>
            </div>

            <div>
              <label htmlFor="pseudo" className="label-text">Pseudo *</label>
              <input
                type="text" id="pseudo" name="pseudo" value={form.pseudo} onChange={handleChange}
                required placeholder="mon_pseudo"
                className={`input-field ${fieldErrors.pseudo ? 'border-red-400' : ''}`}
              />
              {fieldErrors.pseudo
                ? <p className="text-xs text-red-500 mt-1">{fieldErrors.pseudo}</p>
                : <p className="text-xs text-gray-400 mt-1">3 à 100 caractères : lettres, chiffres, - et _</p>
              }
            </div>

            <div>
              <label htmlFor="password" className="label-text">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password" name="password" value={form.password} onChange={handleChange}
                  required autoComplete="new-password" placeholder="••••••••"
                  className={`input-field pr-11 ${fieldErrors.password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Force : <span className="font-medium">{passwordStrength.label}</span></p>
                </div>
              )}
              {fieldErrors.password
                ? <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                : <p className="text-xs text-gray-400 mt-1">6 à 16 caractères, 1 chiffre et 1 spécial (!@#$%^&*)</p>
              }
            </div>

            <div>
              <label htmlFor="confirm_password" className="label-text">Confirmer le mot de passe *</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirm_password" name="confirm_password" value={form.confirm_password} onChange={handleChange}
                  required autoComplete="new-password" placeholder="••••••••"
                  className={`input-field pr-11 ${fieldErrors.confirm_password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  aria-label={showConfirm ? 'Masquer' : 'Afficher'}>
                  {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.confirm_password && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirm_password}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full text-base py-3">
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Création du compte…
                </>
              ) : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-purple-600 hover:underline font-medium">Se connecter</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InscriptionPage;
