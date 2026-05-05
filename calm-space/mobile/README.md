# CalmSpace Mobile 📱

Application mobile React Native (Expo) pour CalmSpace.

## Installation

```bash
cd calm-space-mobile
npm install
```

## Lancer l'appli

```bash
npx expo start
```

Scannez le QR code avec **Expo Go** sur votre téléphone.

## ⚠️ Config réseau (téléphone physique)

Ouvrez `hooks/useAuth.tsx` et changez :

```js
// Pour téléphone physique, mettez votre IP locale :
const API_URL = 'http://192.168.1.XX:5001';

// Pour émulateur Android :
const API_URL = 'http://10.0.2.2:5001';

// Pour simulateur iOS / web :
const API_URL = 'http://localhost:5001';
```

Trouvez votre IP avec `ipconfig` (Windows) → rubrique IPv4.

## Structure

```
app/
  (tabs)/
    index.tsx       → Accueil
    faits.tsx       → Faits bien-être
    respiration.tsx → Respiration guidée
    emotions.tsx    → Journal émotions
    profil.tsx      → Profil utilisateur
  pages/
    connexion.tsx
    inscription.tsx
    diagnostic.tsx         → Échelle de Holmes & Rahe
    historique-emotions.tsx
    favoris.tsx
hooks/
  useAuth.tsx       → Auth + API calls
components/
  Header.tsx
  PageHeader.tsx
  PageTransition.tsx
```

## Backend requis

Le backend Express doit tourner sur le port 5001.
Voir le projet `backend/` de CalmSpace.
