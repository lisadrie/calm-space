import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export interface Decoded {
  id: number;
  civility: string;
  lastname: string;
  firstname: string;
  email: string;
  phone?: string;
  birthdate: string;
  city: string;
  postcode: string;
  pseudo: string;
  active: boolean;
  created: string;
  updated: string;
  role: string;
}

interface AuthContextType {
  decoded: Decoded | null;
  loading: boolean;
  message: string;
  error: string;
  setError: (e: string) => void;
  setMessage: (m: string) => void;
  isAuthentified: () => boolean;
  refreshUser: () => Promise<void>;
  Signup: (
    civility: string, lastname: string, firstname: string, email: string,
    phone: string, birthdate: string, city: string, postcode: string,
    pseudo: string, password: string, confirm_password: string
  ) => Promise<void>;
  Signin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [decoded, setDecoded] = useState<Decoded | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const isAuthentified = () => !!decoded;

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/authme`, { credentials: 'include' });
      setDecoded(res.ok ? await res.json() : null);
    } catch {
      setDecoded(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/authme`, { credentials: 'include' });
      setDecoded(res.ok ? await res.json() : null);
    } catch {
      setDecoded(null);
    }
  }, []);

  const Signup = useCallback(async (
    civility: string, lastname: string, firstname: string, email: string,
    phone: string, birthdate: string, city: string, postcode: string,
    pseudo: string, password: string, confirm_password: string
  ) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          civility, lastname, firstname, email, phone: phone || null,
          birthdate, city, postcode, pseudo, password, confirm_password,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setDecoded(json.user);
        setMessage('Compte créé avec succès !');
        setError('');
        navigate('/');
      } else {
        setError(json.error || 'Une erreur est survenue lors de la création du compte.');
        setMessage('');
      }
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    }
  }, [navigate]);

  const Signin = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok) {
        setDecoded(json.user);
        setMessage('Connexion réussie !');
        setError('');
        navigate('/');
      } else {
        setError(json.error || 'Identifiants incorrects.');
        setMessage('');
      }
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
      setMessage('');
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* cookie already cleared on server error */}
    setDecoded(null);
    navigate('/');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      decoded, loading, message, error,
      setError, setMessage, isAuthentified, refreshUser,
      Signup, Signin, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/** @deprecated import API_URL directly */
export const API = API_URL;
