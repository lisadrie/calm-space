import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import FaitsPage from './pages/FaitsPage';
import RespirPage from './pages/RespirPage';
import EmotionsPage from './pages/EmotionsPage';
import DiagnosticPage from './pages/DiagnosticPage';
import ConnexionPage from './pages/ConnexionPage';
import InscriptionPage from './pages/InscriptionPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faits" element={<FaitsPage />} />
        <Route path="/respiration" element={<RespirPage />} />
        <Route path="/emotions" element={<EmotionsPage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/profil" element={<ProfilePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
