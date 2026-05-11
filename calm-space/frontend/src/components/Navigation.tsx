import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  SparklesIcon,
  CloudIcon,
  FaceSmileIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/',            label: 'Accueil',  Icon: HomeIcon },
  { path: '/faits',       label: 'Faits',    Icon: SparklesIcon },
  { path: '/respiration', label: 'Respirer', Icon: CloudIcon },
  { path: '/emotions',    label: 'Émotions', Icon: FaceSmileIcon },
  { path: '/diagnostic',  label: 'Stress',   Icon: ClipboardDocumentListIcon },
];

const Navigation = () => {
  const location = useLocation();
  const { decoded, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b transition-all duration-300 ${
      scrolled ? 'border-purple-200/60 shadow-soft' : 'border-purple-100/40'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-glow transition-shadow duration-300">
              C
            </div>
            <span className="text-xl font-bold gradient-text">CalmSpace</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(({ path, label, Icon }) => {
              const active = isActive(path);
              return (
                <Link key={path} to={path}>
                  <button className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active ? 'text-purple-700' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/80'
                  }`}>
                    {active && <span className="absolute inset-0 rounded-xl bg-purple-100/70" />}
                    <Icon className="relative w-4 h-4" />
                    <span className="relative">{label}</span>
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* User area desktop */}
          <div className="hidden md:flex items-center gap-2">
            {decoded ? (
              <>
                <Link to="/profil">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {decoded.pseudo.charAt(0).toUpperCase()}
                    </div>
                    <span>{decoded.pseudo}</span>
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/connexion">
                <button className="btn-primary text-sm py-2 px-5">
                  Se connecter
                </button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-purple-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen
              ? <XMarkIcon className="w-5 h-5" />
              : <Bars3Icon className="w-5 h-5" />
            }
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-purple-100/60 py-3 space-y-0.5">
            {navItems.map(({ path, label, Icon }) => {
              const active = isActive(path);
              return (
                <Link key={path} to={path}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-purple-100/70 text-purple-700' : 'text-gray-600 hover:bg-purple-50'
                  }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />}
                  </div>
                </Link>
              );
            })}

            <div className="border-t border-purple-100/60 pt-2 mt-1">
              {decoded ? (
                <>
                  <Link to="/profil">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-50 rounded-xl">
                      <UserCircleIcon className="w-5 h-5" />
                      {decoded.pseudo}
                    </div>
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-50 rounded-xl"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="px-4 py-2">
                  <Link to="/connexion">
                    <button className="btn-primary w-full text-sm py-2.5">
                      Se connecter
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
