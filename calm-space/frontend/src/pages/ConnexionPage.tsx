import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const ConnexionPage = () => {
  const { message, error, Signin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))', boxShadow: '0 0 40px rgba(147,89,210,0.3)' }}
          >
            💜
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Bon Retour</h1>
          <p className="text-gray-500">Connecte-toi pour retrouver ton parcours bien-être</p>
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

          <form
            onSubmit={(e) => { e.preventDefault(); Signin(email, password); }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="email" className="label-text">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ton@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-text">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary w-full text-base py-3">
              Se Connecter
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="text-purple-600 hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/">
            <button className="btn-ghost text-sm text-gray-400">← Retour à l'accueil</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ConnexionPage;
