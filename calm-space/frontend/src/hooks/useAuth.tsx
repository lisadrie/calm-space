import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const API_URL = 'http://localhost:5001';

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
  const [decoded, setDecoded] = useState<Decoded | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const isAuthentified = () => !!decoded;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/authme`, {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setDecoded(json);
        } else {
          setDecoded(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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
          birthdate, city, postcode, pseudo, password, confirm_password
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setDecoded(json.user);
        setMessage('Compte créé avec succès !');
        setError('');
        window.location.href = '/';
      } else {
        const json = await res.json();
        setError(json.error || 'Une erreur est survenue lors de la création du compte.');
        setMessage('');
      }
    } catch (err) {
      setError('Une erreur est survenue.');
      console.error(err);
    }
  }, []);

  const Signin = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const json = await res.json();
        setDecoded(json.user);
        setMessage('Connexion réussie !');
        setError('');
        window.location.href = '/';
      } else {
        const json = await res.json();
        setError(json.error || 'Identifiants incorrects.');
        setMessage('');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
      setMessage('');
      console.error(err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setDecoded(null);
        window.location.href = '/';
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la déconnexion.');
      console.error(err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ decoded, loading, message, error, setError, setMessage, isAuthentified, Signup, Signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const API = API_URL;
