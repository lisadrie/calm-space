// Mocks hoistés avant tout import
jest.mock('../db', () => ({ query: jest.fn() }));
jest.mock('../models/Users');
jest.mock('../models/Moderators');
jest.mock('../models/SuperAdmins');
jest.mock('../models/Admins');
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn().mockResolvedValue('$2b$12$mockedhash')
}));

const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Users = require('../models/Users');
const Moderators = require('../models/Moderators');
const SuperAdmins = require('../models/SuperAdmins');
const Admins = require('../models/Admins');
const { mockUser, generateToken } = require('./helpers');

const validSignupData = {
    civility: 'Madame',
    lastname: 'Dupont',
    firstname: 'Marie',
    email: 'marie@test.com',
    birthdate: '2000-01-01',
    city: 'Paris',
    postcode: '75001',
    pseudo: 'marie25',
    password: 'Test1!',
    confirm_password: 'Test1!'
};

beforeEach(() => {
    Users.existingEmail.mockResolvedValue(null);
    Users.existingPseudo.mockResolvedValue(null);
    Users.create.mockResolvedValue({ ...mockUser, password: '$2b$12$mockedhash' });
    Users.selectByEmail.mockResolvedValue({ ...mockUser, password: '$2b$12$mockedhash', active: true });
    Users.updateProfile.mockResolvedValue({ ...mockUser });
    Moderators.selectByUserID.mockResolvedValue(null);
    SuperAdmins.selectByUserID.mockResolvedValue(null);
    Admins.selectByUserID.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(true);
});

// ─── T-CU-01 — Installation & démarrage ────────────────────────────────────
describe('T-CU-01 — Installation & démarrage', () => {
    test('le serveur Express charge sans erreur', () => {
        expect(app).toBeDefined();
    });

    test('POST /auth/signup répond correctement (HTTP 201)', async () => {
        const res = await request(app).post('/auth/signup').send(validSignupData);
        expect(res.status).toBe(201);
    });
});

// ─── T-CU-02 — Inscription ─────────────────────────────────────────────────
describe('T-CU-02 — Inscription', () => {
    test('données valides → HTTP 201, user et token retournés, password absent', async () => {
        const res = await request(app).post('/auth/signup').send(validSignupData);
        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.body.token).toBeDefined();
        expect(res.body.user.password).toBeUndefined();
    });

    test('email déjà utilisé → HTTP 400', async () => {
        Users.existingEmail.mockResolvedValue({ id: 1 });
        const res = await request(app).post('/auth/signup').send(validSignupData);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("L'adresse e-mail est déjà utilisée.");
    });

    test('format email invalide → HTTP 400', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ ...validSignupData, email: 'pastunmail' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("L'adresse e-mail est incorrecte.");
    });

    test('pseudo déjà utilisé → HTTP 400', async () => {
        Users.existingPseudo.mockResolvedValue({ id: 2 });
        const res = await request(app).post('/auth/signup').send(validSignupData);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Le pseudo est déjà utilisé.');
    });

    test('mot de passe invalide (abc — trop court, sans chiffre ni spécial) → HTTP 400', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ ...validSignupData, password: 'abc', confirm_password: 'abc' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Le mot de passe est incorrect.');
    });
});

// ─── T-CU-03 — Connexion & déconnexion ─────────────────────────────────────
describe('T-CU-03 — Connexion & déconnexion', () => {
    test('identifiants valides → HTTP 200, cookie authToken positionné, token JWT retourné', async () => {
        const res = await request(app)
            .post('/auth/signin')
            .send({ email: 'marie@test.com', password: 'Test1!' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.body.user.password).toBeUndefined();
    });

    test('mot de passe incorrect → HTTP 400', async () => {
        bcrypt.compare.mockResolvedValue(false);
        const res = await request(app)
            .post('/auth/signin')
            .send({ email: 'marie@test.com', password: 'mauvais' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Le mot de passe est incorrect.');
    });

    test('GET /auth/authme sans token ni cookie → HTTP 401', async () => {
        const res = await request(app).get('/auth/authme');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('GET /auth/authme avec Bearer token valide → HTTP 200, données utilisateur', async () => {
        const token = generateToken();
        const res = await request(app)
            .get('/auth/authme')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe('marie@test.com');
    });

    test('POST /auth/logout → HTTP 200, cookie authToken supprimé', async () => {
        const token = generateToken();
        const res = await request(app)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const cookies = res.headers['set-cookie'];
        expect(cookies.some(c => c.startsWith('authToken=;') || c.includes('authToken=;'))).toBe(true);
    });
});

// ─── T-CU-04 — Modification du profil ──────────────────────────────────────
describe('T-CU-04 — Modification du profil', () => {
    const profileData = {
        civility: 'Madame',
        lastname: 'Dupont',
        firstname: 'Marie',
        email: 'marie@test.com',
        birthdate: '2000-01-01',
        city: 'Paris',
        postcode: '75001',
        pseudo: 'marie_paris'
    };

    test('modification valide → HTTP 200, nouveau token généré', async () => {
        Users.updateProfile.mockResolvedValue({ ...mockUser, pseudo: 'marie_paris' });
        const token = generateToken();
        const res = await request(app)
            .put('/auth/updateprofile')
            .set('Authorization', `Bearer ${token}`)
            .send(profileData);
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('pseudo déjà pris → HTTP 400', async () => {
        Users.existingPseudo.mockResolvedValue({ id: 99 });
        const token = generateToken({ ...mockUser, pseudo: 'autre_pseudo' });
        const res = await request(app)
            .put('/auth/updateprofile')
            .set('Authorization', `Bearer ${token}`)
            .send({ ...profileData, pseudo: 'pseudo_existant' });
        expect(res.status).toBe(400);
    });

    test('PUT /auth/updateprofile sans token → HTTP 401', async () => {
        const res = await request(app).put('/auth/updateprofile').send(profileData);
        expect(res.status).toBe(401);
    });
});
