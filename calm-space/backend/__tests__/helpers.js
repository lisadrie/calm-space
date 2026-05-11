const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'calmspace_secret_123';

const mockUser = {
    id: 1,
    civility: 'Madame',
    lastname: 'Dupont',
    firstname: 'Marie',
    email: 'marie@test.com',
    phone: null,
    birthdate: '2000-01-01',
    city: 'Paris',
    postcode: '75001',
    pseudo: 'marie25',
    active: true,
    created: '2024-01-01T00:00:00.000Z',
    updated: '2024-01-01T00:00:00.000Z',
    role: 'Utilisateur'
};

const generateToken = (payload = mockUser) => jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

const generateExpiredToken = (payload = mockUser) => jwt.sign(payload, SECRET_KEY, { expiresIn: '-1s' });

module.exports = { mockUser, generateToken, generateExpiredToken };
