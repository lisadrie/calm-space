jest.mock('../db', () => ({ query: jest.fn() }));
jest.mock('../models/Favorites');
jest.mock('../models/Moderators');
jest.mock('../models/SuperAdmins');
jest.mock('../models/Admins');

const request = require('supertest');
const app = require('../app');
const Favorites = require('../models/Favorites');
const { generateToken } = require('./helpers');

const mockFavorite = {
    id: 1,
    user_id: 1,
    fact_text: 'Les dauphins dorment avec un seul hémisphère du cerveau à la fois.',
    fact_type: 'reassuring',
    created_at: '2024-01-01T00:00:00.000Z'
};

beforeEach(() => {
    Favorites.selectByUserID.mockResolvedValue([mockFavorite]);
    Favorites.create.mockResolvedValue(mockFavorite);
    Favorites.remove.mockResolvedValue(mockFavorite);
});

// ─── T-IN-02 — Mise en favori d'un fait ────────────────────────────────────
describe("T-IN-02 — Mise en favori d'un fait", () => {
    test('ajouter un favori (POST /favorites) → HTTP 201, favori retourné', async () => {
        const token = generateToken();
        const res = await request(app)
            .post('/favorites')
            .set('Authorization', `Bearer ${token}`)
            .send({ fact_text: mockFavorite.fact_text, fact_type: 'reassuring' });
        expect(res.status).toBe(201);
        expect(res.body.fact_text).toBe(mockFavorite.fact_text);
        expect(res.body.fact_type).toBe('reassuring');
    });

    test('GET /favorites → HTTP 200, liste des favoris retournée', async () => {
        const token = generateToken();
        const res = await request(app)
            .get('/favorites')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
    });

    test('supprimer un favori (DELETE /favorites/:id) → HTTP 200', async () => {
        const token = generateToken();
        const res = await request(app)
            .delete('/favorites/1')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    test('POST /favorites sans authentification → HTTP 401', async () => {
        const res = await request(app)
            .post('/favorites')
            .send({ fact_text: mockFavorite.fact_text, fact_type: 'reassuring' });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('DELETE /favorites/:id sans authentification → HTTP 401', async () => {
        const res = await request(app).delete('/favorites/1');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('supprimer un favori introuvable → HTTP 404', async () => {
        Favorites.remove.mockResolvedValue(null);
        const token = generateToken();
        const res = await request(app)
            .delete('/favorites/999')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });
});
