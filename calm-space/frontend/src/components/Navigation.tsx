import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {
  const location = useLocation();
  const { decoded, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Accueil', emoji: '🏠' },
    { path: '/faits', label: 'Faits', emoji: '✨' },
    { path: '/respiration', label: 'Respirer', emoji: '🌬️' },
    { path: '/emotions', label: 'Émotions', emoji: '😊' },
    { path: '/diagnostic', label: 'Stress', emoji: '🧠' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/favicon.ico" alt="CalmSpace" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-bold gradient-text">CalmSpace</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <span>{item.emoji}</span>
                  {item.label}
                </button>
              </Link>
            ))}
          </div>

          {/* User button desktop */}
          <div className="hidden md:flex items-center gap-2">
            {decoded ? (
              <>
                <Link to="/profil">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                      {decoded.pseudo.charAt(0).toUpperCase()}
                    </div>
                    {decoded.pseudo}
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/connexion">
                <button className="btn-primary text-sm py-2 px-4">
                  Se connecter
                </button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-purple-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-purple-100 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}>
                  <span>{item.emoji}</span>
                  {item.label}
                </div>
              </Link>
            ))}
            <div className="border-t border-purple-100 pt-2 mt-2">
              {decoded ? (
                <>
                  <Link to="/profil" onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-xl">
                      👤 {decoded.pseudo}
                    </div>
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl"
                  >
                    🚪 Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/connexion" onClick={() => setMenuOpen(false)}>
                  <div className="mx-4 btn-primary text-center text-sm">Se connecter</div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
