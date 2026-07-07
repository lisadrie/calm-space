require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// --- Sécurité : en-têtes HTTP protecteurs (anti-XSS, clickjacking, sniffing MIME…) ---
// La politique "cross-origin" est assouplie car l'API est consommée par le
// frontend hébergé sur une autre origine (port différent).
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const ALLOWED_ORIGINS = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : [
        'http://localhost:3000',  // CRA
        'http://localhost:5173',  // Vite
        'http://localhost:8081',  // Expo web
        'http://172.20.10.3:8081',
      ];

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // curl / Postman / same-origin
        if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        cb(new Error(`CORS bloqué : ${origin}`));
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// --- Sécurité : limitation du débit des requêtes (anti déni de service) ---
// Désactivée pendant les tests automatisés (NODE_ENV=test) pour ne pas gêner Jest.
const skipInTests = () => process.env.NODE_ENV === 'test';

// Limiteur général : 300 requêtes / 15 min / adresse IP
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipInTests,
}));

// Limiteur renforcé sur l'authentification : 10 tentatives / 15 min / IP
// (protège contre les attaques par force brute sur la connexion et l'inscription)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: 'Trop de tentatives. Merci de réessayer dans quelques minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipInTests,
});
app.use('/auth/signin', authLimiter);
app.use('/auth/signup', authLimiter);

app.use('/auth', require('./routes/Auth'));
app.use('/users', require('./routes/Users'));
app.use('/emotions', require('./routes/Emotions'));
app.use('/favorites', require('./routes/Favorites'));
app.use('/stress', require('./routes/Stress'));
app.use('/admin', require('./routes/Admin'));

module.exports = app;
