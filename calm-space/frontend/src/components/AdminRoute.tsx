import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { decoded, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen soft-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!decoded) return <Navigate to="/connexion" replace />;
  if (decoded.role !== 'Super Admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
