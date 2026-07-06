import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/admin',               label: 'Tableau de bord', Icon: Squares2X2Icon, end: true },
  { to: '/admin/utilisateurs',  label: 'Utilisateurs',    Icon: UsersIcon,      end: false },
];

const AdminLayout = () => {
  const { decoded, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col"
        style={{ background: 'linear-gradient(180deg, hsl(265,75%,20%) 0%, hsl(265,75%,14%) 100%)' }}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))' }}>
              <ChartBarIcon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm leading-none">Calm Space</p>
              <p className="text-purple-300 text-xs mt-0.5">Back-office</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                }`
              }>
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))' }}>
              {decoded?.firstname?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{decoded?.firstname} {decoded?.lastname}</p>
              <p className="text-purple-300 text-xs truncate">{decoded?.role}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-purple-200 hover:bg-white/10 hover:text-white transition-colors">
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
