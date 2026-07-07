jest.mock('../db', () => ({ query: jest.fn() }));
jest.mock('../models/Users');
jest.mock('../models/Emotions');
jest.mock('../models/Favorites');
jest.mock('../models/Moderators');
jest.mock('../models/SuperAdmins');
jest.mock('../models/Admins');

const request = require('supertest');
const app = require('../app');
const { generateExpiredToken } = require('./helpers');

// ─── T-SEC-01 — Protection des routes API ──────────────────────────────────
describe('T-SEC-01 — Protection des routes API', () => {
    test('GET /auth/authme sans token ni cookie → HTTP 401', async () => {
        const res = await request(app).get('/auth/authme');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('POST /emotions sans token ni cookie → HTTP 401', async () => {
        const res = await request(app)
            .post('/emotions')
            .send({ emotion: 'Heureux' });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('DELETE /favorites/:id sans token → HTTP 401', async () => {
        const res = await request(app).delete('/favorites/1');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('cookie authToken falsifié → HTTP 401', async () => {
        const res = await request(app)
            .get('/auth/authme')
            .set('Cookie', 'authToken=invalid.jwt.token');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('Bearer token falsifié → HTTP 401', async () => {
        const res = await request(app)
            .post('/emotions')
            .set('Authorization', 'Bearer invalid.token')
            .send({ emotion: 'Heureux' });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test("injection SQL dans le champ email → HTTP 400, rejeté par la validation", async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                civility: 'Madame',
                lastname: 'Dupont',
                firstname: 'Marie',
                email: "' OR 1=1 --",
                birthdate: '2000-01-01',
                city: 'Paris',
                postcode: '75001',
                pseudo: 'marie25',
                password: 'Test1!',
                confirm_password: 'Test1!'
            });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("L'adresse e-mail est incorrecte.");
    });

    test('token JWT expiré → HTTP 401 (TokenExpiredError)', async () => {
        const expiredToken = generateExpiredToken();
        const res = await request(app)
            .get('/auth/authme')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });
});

// ─── T-SEC-02 — En-têtes de sécurité HTTP (helmet) ──────────────────────────
describe('T-SEC-02 — En-têtes de sécurité HTTP (helmet)', () => {
    test('X-Content-Type-Options: nosniff est présent (anti MIME-sniffing)', async () => {
        const res = await request(app).get('/auth/authme');
        expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    test("X-Powered-By est masqué (ne révèle pas qu'on utilise Express)", async () => {
        const res = await request(app).get('/auth/authme');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    test('X-Frame-Options est défini (anti-clickjacking)', async () => {
        const res = await request(app).get('/auth/authme');
        expect(res.headers['x-frame-options']).toBeDefined();
    });
});
