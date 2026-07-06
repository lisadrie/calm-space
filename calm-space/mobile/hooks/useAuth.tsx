import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';

export { API_URL };

interface Decoded {
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
    token: string | null;
    isAuthentified: () => boolean;
    Signup: (
        civility: string, lastname: string, firstname: string,
        email: string, phone: string, birthdate: string,
        city: string, postcode: string, pseudo: string,
        password: string, confirm_password: string
    ) => Promise<void>;
    Signin: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<Decoded>) => Promise<void>;
    clearMessages: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [decoded, setDecoded] = useState<Decoded | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const isAuthentified = () => !!decoded;
    const clearMessages = () => { setMessage(''); setError(''); };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('auth_token');
                if (!storedToken) { setLoading(false); return; }
                const res = await fetch(`${API_URL}/auth/authme`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    setDecoded(json);
                    setToken(storedToken);
                } else {
                    setDecoded(null);
                    setToken(null);
                    await SecureStore.deleteItemAsync('auth_token');
                }
            } catch {
                // silent – no server on first load (offline/dev)
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const Signup = useCallback(async (
        civility: string, lastname: string, firstname: string,
        email: string, phone: string, birthdate: string,
        city: string, postcode: string, pseudo: string,
        password: string, confirm_password: string
    ) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ civility, lastname, firstname, email, phone: phone || null, birthdate, city, postcode, pseudo, password, confirm_password }),
            });
            const json = await res.json();
            if (res.ok) {
                if (json.token) {
                    await SecureStore.setItemAsync('auth_token', json.token);
                    setToken(json.token);
                    setDecoded(json.user || json);
                }
                setMessage('Compte créé avec succès !');
                setError('');
            } else {
                setError(json.error || 'Une erreur est survenue.');
                setMessage('');
            }
        } catch {
            setError('Impossible de contacter le serveur.');
        }
    }, []);

    const Signin = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json();
            if (res.ok) {
                if (json.token) {
                    await SecureStore.setItemAsync('auth_token', json.token);
                    setToken(json.token);
                    setDecoded(json.user || json);
                }
                setMessage('Connexion réussie !');
                setError('');
            } else {
                setError(json.error || 'Identifiants incorrects.');
                setMessage('');
            }
        } catch {
            setError('Impossible de contacter le serveur.');
        }
    }, []);

    const logout = useCallback(async () => {
        await SecureStore.deleteItemAsync('auth_token');
        setDecoded(null);
        setToken(null);
        setMessage('');
        setError('');
    }, []);

    const updateProfile = useCallback(async (data: Partial<Decoded>) => {
        try {
            const storedToken = await SecureStore.getItemAsync('auth_token');
            const res = await fetch(`${API_URL}/auth/updateprofile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${storedToken}` },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (res.ok) {
                setDecoded(json.user || json);
                setMessage('Profil mis à jour !');
                setError('');
            } else {
                setError(json.error || 'Erreur lors de la mise à jour.');
                setMessage('');
            }
        } catch {
            setError('Impossible de contacter le serveur.');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ decoded, loading, message, error, token, isAuthentified, Signup, Signin, logout, updateProfile, clearMessages }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
