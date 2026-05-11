jest.mock('../db', () => ({ query: jest.fn() }));
jest.mock('../models/StressAssessments');
jest.mock('../models/Moderators');
jest.mock('../models/SuperAdmins');
jest.mock('../models/Admins');

const request = require('supertest');
const app = require('../app');
const StressAssessments = require('../models/StressAssessments');
const { generateToken } = require('./helpers');

const mockAssessment = {
    id: 1,
    user_id: 1,
    total_score: 250,
    selected_events: [1, 3, 7],
    created_at: '2024-01-01T00:00:00.000Z'
};

beforeEach(() => {
    StressAssessments.selectByUserID.mockResolvedValue([mockAssessment]);
    StressAssessments.create.mockResolvedValue(mockAssessment);
});

// ─── T-DS-01 — Diagnostic de stress Holmes-Rahe ────────────────────────────
describe('T-DS-01 — Diagnostic de stress Holmes-Rahe', () => {
    test('POST /stress avec événements cochés → HTTP 201, score et événements stockés', async () => {
        const token = generateToken();
        const res = await request(app)
            .post('/stress')
            .set('Authorization', `Bearer ${token}`)
            .send({ total_score: 250, selected_events: [1, 3, 7] });
        expect(res.status).toBe(201);
        expect(res.body.total_score).toBe(250);
        expect(res.body.selected_events).toEqual([1, 3, 7]);
    });

    test('GET /stress → HTTP 200, liste des diagnostics de l\'utilisateur', async () => {
        const token = generateToken();
        const res = await request(app)
            .get('/stress')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].total_score).toBe(250);
    });

    test('POST /stress sans authentification → HTTP 401', async () => {
        const res = await request(app)
            .post('/stress')
            .send({ total_score: 250, selected_events: [1, 3, 7] });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('POST /stress sans total_score → HTTP 400', async () => {
        const token = generateToken();
        const res = await request(app)
            .post('/stress')
            .set('Authorization', `Bearer ${token}`)
            .send({ selected_events: [1, 3, 7] });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Le score total est requis.');
    });
});
