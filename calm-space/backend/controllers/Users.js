const Validations = require("../components/Validations");

const Users = require("../models/Users");

const selectAllUsers = async (req, res) => {
    try {
        const users = await Users.selectAll();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const selectUserByID = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await Users.selectByID(id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createUser = async (req, res) => {
    const { civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password } = req.body;
    try {
        if (!civility) return res.status(400).json({ message: "La civilité est requise." });
        if (!Validations.Civility(civility)) return res.status(400).json({ message: "La civilité est incorrecte." });
        if (!lastname) return res.status(400).json({ message: "Le nom est requis." });
        if (!Validations.Names(lastname)) return res.status(400).json({ message: "Le nom est incorrect." });
        if (!firstname) return res.status(400).json({ message: "Le prénom est requis." });
        if (!Validations.Names(firstname)) return res.status(400).json({ message: "Le prénom est incorrect." });
        if (!email) return res.status(400).json({ message: "L'adresse e-mail est requise." });
        if (!Validations.Email(email)) return res.status(400).json({ message: "L'adresse e-mail est incorrecte." });
        if (await Users.existingEmail(email)) return res.status(400).json({ error: "L'adresse e-mail est déjà utilisée." });
        if (phone && !Validations.Phone(phone)) return res.status(400).json({ message: "Le numéro de téléphone est incorrect." });
        if (!birthdate) return res.status(400).json({ message: "La date de naissance est requise." });
        if (!Validations.Birthdate(birthdate)) return res.status(400).json({ message: "La date de naissance est incorrecte." });
        if (!city) return res.status(400).json({ message: "La ville est requise." });
        if (!Validations.City(city)) return res.status(400).json({ message: "La ville est incorrecte." });
        if (!postcode) return res.status(400).json({ message: "Le code postal est requis." });
        if (!Validations.Postcode(postcode)) return res.status(400).json({ message: "Le code postal est incorrect." });
        if (!pseudo) return res.status(400).json({ message: "Le pseudo est requis." });
        if (!Validations.Pseudo(pseudo)) return res.status(400).json({ message: "Le pseudo est incorrect." });
        if (await Users.existingPseudo(pseudo)) return res.status(400).json({ error: "Le pseudo est déjà utilisé." });
        if (!password) return res.status(400).json({ message: "Le mot de passe est requis." });
        if (!Validations.Password(password)) return res.status(400).json({ message: "Le mot de passe est incorrect." });
        const user = await Users.create(civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password);
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password } = req.body;
    try {
        if (!civility) return res.status(400).json({ message: "La civilité est requise." });
        if (!Validations.Civility(civility)) return res.status(400).json({ message: "La civilité est incorrecte." });
        if (!lastname) return res.status(400).json({ message: "Le nom est requis." });
        if (!Validations.Names(lastname)) return res.status(400).json({ message: "Le nom est incorrect." });
        if (!firstname) return res.status(400).json({ message: "Le prénom est requis." });
        if (!Validations.Names(firstname)) return res.status(400).json({ message: "Le prénom est incorrect." });
        if (!email) return res.status(400).json({ message: "L'adresse e-mail est requise." });
        if (!Validations.Email(email)) return res.status(400).json({ message: "L'adresse e-mail est incorrecte." });
        if (phone && !Validations.Phone(phone)) return res.status(400).json({ message: "Le numéro de téléphone est incorrect." });
        if (!birthdate) return res.status(400).json({ message: "La date de naissance est requise." });
        if (!Validations.Birthdate(birthdate)) return res.status(400).json({ message: "La date de naissance est incorrecte." });
        if (!city) return res.status(400).json({ message: "La ville est requise." });
        if (!Validations.City(city)) return res.status(400).json({ message: "La ville est incorrecte." });
        if (!postcode) return res.status(400).json({ message: "Le code postal est requis." });
        if (!Validations.Postcode(postcode)) return res.status(400).json({ message: "Le code postal est incorrect." });
        if (!pseudo) return res.status(400).json({ message: "Le pseudo est requis." });
        if (!Validations.Pseudo(pseudo)) return res.status(400).json({ message: "Le pseudo est incorrect." });
        if (!password) return res.status(400).json({ message: "Le mot de passe est requis." });
        if (!Validations.Password(password)) return res.status(400).json({ message: "Le mot de passe est incorrect." });
        const user = await Users.update(id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const removeUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await Users.remove(id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const activeUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await Users.active(id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deactiveUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await Users.deactive(id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { selectAllUsers, selectUserByID, createUser, updateUser, removeUser, activeUser, deactiveUser };
