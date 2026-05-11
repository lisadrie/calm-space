jest.mock('../db', () => ({ query: jest.fn() }));
jest.mock('../models/Emotions');
jest.mock('../models/Moderators');
jest.mock('../models/SuperAdmins');
jest.mock('../models/Admins');

const request = require('supertest');
const app = require('../app');
const Emotions = require('../models/Emotions');
const { generateToken } = require('./helpers');

const mockEmotion = {
    id: 1,
    user_id: 1,
    emotion: 'Heureux',
    emoji: '😊',
    color: '#FFD700',
    logged_at: '2024-01-01T00:00:00.000Z'
};

beforeEach(() => {
    Emotions.selectByUserID.mockResolvedValue([mockEmotion]);
    Emotions.create.mockResolvedValue(mockEmotion);
    Emotions.remove.mockResolvedValue(mockEmotion);
});

// ─── T-EM-01 — Enregistrement d'une émotion ────────────────────────────────
describe("T-EM-01 — Enregistrement d'une émotion", () => {
    test('POST /emotions avec données valides → HTTP 201, émotion enregistrée', async () => {
        const token = generateToken();
        const res = await request(app)
            .post('/emotions')
            .set('Authorization', `Bearer ${token}`)
            .send({ emotion: 'Heureux', emoji: '😊', color: '#FFD700' });
        expect(res.status).toBe(201);
        expect(res.body.emotion).toBe('Heureux');
        expect(res.body.emoji).toBe('😊');
        expect(res.body.color).toBe('#FFD700');
    });

    test('POST /emotions sans authentification → HTTP 401', async () => {
        const res = await request(app)
            .post('/emotions')
            .send({ emotion: 'Heureux', emoji: '😊', color: '#FFD700' });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test("POST /emotions sans le champ émotion → HTTP 400", async () => {
        const token = generateToken();
        const res = await request(app)
            .post('/emotions')
            .set('Authorization', `Bearer ${token}`)
            .send({ emoji: '😊', color: '#FFD700' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("L'émotion est requise.");
    });
});

// ─── T-EM-02 — Historique des émotions ─────────────────────────────────────
describe("T-EM-02 — Historique des émotions", () => {
    test('GET /emotions → HTTP 200, liste avec champ logged_at', async () => {
        const token = generateToken();
        const res = await request(app)
            .get('/emotions')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].logged_at).toBeDefined();
    });

    test('PUT /emotions/:id → HTTP 404 (route non implémentée)', async () => {
        const token = generateToken();
        const res = await request(app)
            .put('/emotions/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ emotion: 'Triste' });
        expect(res.status).toBe(404);
    });

    test('DELETE /emotions/:id → HTTP 200, émotion supprimée', async () => {
        const token = generateToken();
        const res = await request(app)
            .delete('/emotions/1')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    test('GET /emotions sans authentification → HTTP 401', async () => {
        const res = await request(app).get('/emotions');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('DELETE /emotions/:id introuvable → HTTP 404', async () => {
        Emotions.remove.mockResolvedValue(null);
        const token = generateToken();
        const res = await request(app)
            .delete('/emotions/999')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });
});
