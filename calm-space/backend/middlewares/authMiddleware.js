require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const Moderators = require('../models/Moderators');
const SuperAdmins = require('../models/SuperAdmins');
const Admins = require('../models/Admins');

const isLogged = (req, res, next) => {
    // Cookie (frontend web) ou Bearer token (mobile)
    const cookieToken = req.cookies.authToken;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const isModerator = async (req, res, next) => {
    const decoded = req.user;
    try {
        const moderator = await Moderators.selectByID(decoded.id);
        if (moderator) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const isSuperAdmin = async (req, res, next) => {
    const decoded = req.user;
    try {
        const admin = await SuperAdmins.selectByID(decoded.id);
        if (admin) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const isAdmin = async (req, res, next) => {
    const decoded = req.user;
    try {
        const admin = await Admins.selectByID(decoded.id);
        if (admin) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { isLogged, isModerator, isSuperAdmin, isAdmin };