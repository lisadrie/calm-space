require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

const Validations = require('../components/Validations');

const Users = require('../models/Users');
const Moderators = require('../models/Moderators');
const SuperAdmins = require('../models/SuperAdmins');
const Admins = require('../models/Admins');

const Signup = async (req, res) => {
    const { civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password, confirm_password } = req.body;
    try {
        if (!civility) return res.status(400).json({ error: "La civilité est requise." });
        if (!Validations.Civility(civility)) return res.status(400).json({ error: "La civilité est incorrecte." });
        if (!lastname) return res.status(400).json({ error: "Le nom est requis." });
        if (!Validations.Names(lastname)) return res.status(400).json({ error: "Le nom est incorrect." });
        if (!firstname) return res.status(400).json({ error: "Le prénom est requis." });
        if (!Validations.Names(firstname)) return res.status(400).json({ error: "Le prénom est incorrect." });
        if (!email) return res.status(400).json({ error: "L'adresse e-mail est requise." });
        if (!Validations.Email(email)) return res.status(400).json({ error: "L'adresse e-mail est incorrecte." });
        if (await Users.existingEmail(email)) return res.status(400).json({ error: "L'adresse e-mail est déjà utilisée." });
        if (phone && !Validations.Phone(phone)) return res.status(400).json({ error: "Le numéro de téléphone est incorrect." });
        if (!birthdate) return res.status(400).json({ error: "La date de naissance est requise." });
        if (!Validations.Birthdate(birthdate)) return res.status(400).json({ error: "La date de naissance est incorrecte." });
        if (!city) return res.status(400).json({ error: "La ville est requise." });
        if (!Validations.City(city)) return res.status(400).json({ error: "La ville est incorrecte." });
        if (!postcode) return res.status(400).json({ error: "Le code postal est requis." });
        if (!Validations.Postcode(postcode)) return res.status(400).json({ error: "Le code postal est incorrect." });
        if (!pseudo) return res.status(400).json({ error: "Le pseudo est requis." });
        if (!Validations.Pseudo(pseudo)) return res.status(400).json({ error: "Le pseudo est incorrect." });
        if (await Users.existingPseudo(pseudo)) return res.status(400).json({ error: "Le pseudo est déjà utilisé." });
        if (!password) return res.status(400).json({ error: "Le mot de passe est requis." });
        if (!Validations.Password(password)) return res.status(400).json({ error: "Le mot de passe est incorrect." });
        if (!confirm_password) return res.status(400).json({ error: "La confirmation du mot de passe est requise." });
        if (password !== confirm_password) return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
        const user = await Users.create(civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password);
        const moderator = await Moderators.selectByUserID(user.id);
        const superAdmin = await SuperAdmins.selectByUserID(user.id);
        const admin = await Admins.selectByUserID(user.id);
        user.role = "Utilisateur";
        if (moderator) user.role = "Modérateur";
        if (superAdmin) user.role = "Super Admin";
        if (admin) user.role = "Admin";
        const token = jwt.sign(
            {
                id: user.id,
                civility: user.civility,
                lastname: user.lastname,
                firstname: user.firstname,
                email: user.email,
                phone: user.phone,
                birthdate: user.birthdate,
                city: user.city,
                postcode: user.postcode,
                pseudo: user.pseudo,
                active: user.active,
                created: user.created,
                updated: user.updated,
                role: user.role
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.cookie('authToken', token, {
            // Le jeton est inaccessible au JavaScript de la page : meme en cas
            // de XSS, un script injecte ne peut pas le lire ni l'exfiltrer.
            httpOnly: true,
            // Cookie transmis uniquement en HTTPS des que l'application est
            // deployee (en local, le developpement se fait en HTTP).
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000
        });
        delete user.password;
        res.status(201).json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const Signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email) return res.status(400).json({ error: "L'adresse e-mail est requise." });
        if (!Validations.Email(email)) return res.status(400).json({ error: "L'adresse e-mail est incorrecte." });
        if (!password) return res.status(400).json({ error: "Le mot de passe est requis." });
        if (!Validations.Password(password)) return res.status(400).json({ error: "Le mot de passe est incorrect." });
        const user = await Users.selectByEmail(email);
        if (!user) return res.status(400).json({ error: "L'adresse e-mail est incorrecte." });
        if (!user.active) return res.status(400).json({ error: "Le compte est désactivé." });
        if (await bcrypt.compare(password, user.password)) {
            const moderator = await Moderators.selectByUserID(user.id);
            const superAdmin = await SuperAdmins.selectByUserID(user.id);
            const admin = await Admins.selectByUserID(user.id);
            user.role = "Utilisateur";
            if (moderator) user.role = "Modérateur";
            if (superAdmin) user.role = "Super Admin";
            if (admin) user.role = "Admin";
            const token = jwt.sign(
                {
                    id: user.id,
                    civility: user.civility,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    email: user.email,
                    phone: user.phone,
                    birthdate: user.birthdate,
                    city: user.city,
                    postcode: user.postcode,
                    pseudo: user.pseudo,
                    active: user.active,
                    created: user.created,
                    updated: user.updated,
                    role: user.role
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 3600000
            });
            delete user.password;
            res.status(200).json({ user, token });
        } else {
            res.status(400).json({ error: "Le mot de passe est incorrect." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const authMe = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.status(200).json({ message: "Déconnexion réussie." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateProfile = async (req, res) => {
    const { civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo } = req.body;
    const id = req.user.id;
    try {
        if (!civility) return res.status(400).json({ message: "La civilité est requise." });
        if (!Validations.Civility(civility)) return res.status(400).json({ message: "La civilité est incorrecte." });
        if (!lastname) return res.status(400).json({ message: "Le nom est requis." });
        if (!Validations.Names(lastname)) return res.status(400).json({ message: "Le nom est incorrect." });
        if (!firstname) return res.status(400).json({ message: "Le prénom est requis." });
        if (!Validations.Names(firstname)) return res.status(400).json({ message: "Le prénom est incorrect." });
        if (!email) return res.status(400).json({ message: "L'adresse e-mail est requise." });
        if (!Validations.Email(email)) return res.status(400).json({ message: "L'adresse e-mail est incorrecte." });
        if (req.user.email !== email && await Users.existingEmail(email)) return res.status(400).json({ message: "L'adresse e-mail est déjà utilisée." });
        if (phone && !Validations.Phone(phone)) return res.status(400).json({ message: "Le numéro de téléphone est incorrect." });
        if (!birthdate) return res.status(400).json({ message: "La date de naissance est requise." });
        if (!Validations.Birthdate(birthdate)) return res.status(400).json({ message: "La date de naissance est incorrecte." });
        if (!pseudo) return res.status(400).json({ error: "Le pseudo est requis." });
        if (!Validations.Pseudo(pseudo)) return res.status(400).json({ error: "Le pseudo est incorrect." });
        if (req.user.pseudo !== pseudo && await Users.existingPseudo(pseudo)) return res.status(400).json({ error: "Le pseudo est déjà utilisé." });
        if (!city) return res.status(400).json({ message: "La ville est requise." });
        if (!Validations.City(city)) return res.status(400).json({ message: "La ville est incorrecte." });
        if (!postcode) return res.status(400).json({ message: "Le code postal est requis." });
        if (!Validations.Postcode(postcode)) return res.status(400).json({ message: "Le code postal est incorrect." });
        const user = await Users.updateProfile(id, { civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo });
        const moderator = await Moderators.selectByUserID(user.id);
        const superAdmin = await SuperAdmins.selectByUserID(user.id);
        const admin = await Admins.selectByUserID(user.id);
        user.role = "Utilisateur";
        if (moderator) user.role = "Modérateur";
        if (superAdmin) user.role = "Super Admin";
        if (admin) user.role = "Admin";
        const token = jwt.sign(
            {
                id: user.id,
                civility: user.civility,
                lastname: user.lastname,
                firstname: user.firstname,
                email: user.email,
                phone: user.phone,
                birthdate: user.birthdate,
                city: user.city,
                postcode: user.postcode,
                pseudo: user.pseudo,
                active: user.active,
                created: user.created,
                updated: user.updated,
                role: user.role
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.cookie('authToken', token, {
            // Le jeton est inaccessible au JavaScript de la page : meme en cas
            // de XSS, un script injecte ne peut pas le lire ni l'exfiltrer.
            httpOnly: true,
            // Cookie transmis uniquement en HTTPS des que l'application est
            // deployee (en local, le developpement se fait en HTTP).
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000
        });
        delete user.password;
        res.status(200).json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { Signup, Signin, authMe, logout, updateProfile };
