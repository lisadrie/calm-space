require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

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

app.use('/auth', require('./routes/Auth'));
app.use('/users', require('./routes/Users'));
app.use('/emotions', require('./routes/Emotions'));
app.use('/favorites', require('./routes/Favorites'));
app.use('/stress', require('./routes/Stress'));
app.use('/admin', require('./routes/Admin'));

module.exports = app;
