const client = require("../db");
const bcrypt = require("bcrypt");

const Sanitize = require("../components/Sanitize");

const selectAll = async () => {
    try {
        const query = await client.query(
            "SELECT id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, active, created, updated FROM users"
        );
        return query.rows;
    } catch (err) {
        console.error(err);
    }
};

const selectByID = async (id) => {
    try {
        const query = await client.query(
            "SELECT id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, active, created, updated FROM users WHERE id = $1",
            [id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const selectByEmail = async (email) => {
    email = Sanitize.Email(email);
    try {
        const query = await client.query(
            "SELECT id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password, active, created, updated FROM users WHERE email = $1",
            [email]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const selectByPseudo = async (pseudo) => {
    pseudo = Sanitize.Pseudo(pseudo);
    try {
        const query = await client.query(
            "SELECT id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password, active, created, updated FROM users WHERE pseudo = $1",
            [pseudo]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const existingEmail = async (email) => {
    email = Sanitize.Email(email);
    try {
        const query = await client.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const existingPseudo = async (pseudo) => {
    pseudo = Sanitize.Pseudo(pseudo);
    try {
        const query = await client.query(
            "SELECT id FROM users WHERE pseudo = $1",
            [pseudo]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const create = async (civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password) => {
    civility = Sanitize.Civility(civility);
    lastname = Sanitize.Lastname(lastname);
    firstname = Sanitize.Firstname(firstname);
    email = Sanitize.Email(email);
    phone = phone ? Sanitize.Phone(phone) : null;
    birthdate = Sanitize.Birthdate(birthdate);
    city = Sanitize.City(city);
    postcode = Sanitize.Postcode(postcode);
    pseudo = Sanitize.Pseudo(pseudo);
    const hash = await bcrypt.hash(password, 12);
    try {
        const query = await client.query(
            "INSERT INTO users (civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, active, created, updated",
            [civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, hash]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const update = async (id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, password) => {
    civility = Sanitize.Civility(civility);
    lastname = Sanitize.Lastname(lastname);
    firstname = Sanitize.Firstname(firstname);
    email = Sanitize.Email(email);
    phone = phone ? Sanitize.Phone(phone) : null;
    birthdate = Sanitize.Birthdate(birthdate);
    city = Sanitize.City(city);
    postcode = Sanitize.Postcode(postcode);
    pseudo = Sanitize.Pseudo(pseudo);
    const hash = await bcrypt.hash(password, 12);
    try {
        const query = await client.query(
            "UPDATE users SET civility = $1, lastname = $2, firstname = $3, email = $4, phone = $5, birthdate = $6, city = $7, postcode = $8, pseudo = $9, password = $10, updated = CURRENT_TIMESTAMP WHERE id = $11 RETURNING id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, active, created, updated",
            [civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, hash, id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const updateProfile = async (id, { civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo }) => {
    civility = Sanitize.Civility(civility);
    lastname = Sanitize.Lastname(lastname);
    firstname = Sanitize.Firstname(firstname);
    email = Sanitize.Email(email);
    phone = phone ? Sanitize.Phone(phone) : null;
    birthdate = Sanitize.Birthdate(birthdate);
    city = Sanitize.City(city);
    postcode = Sanitize.Postcode(postcode);
    pseudo = Sanitize.Pseudo(pseudo);
    try {
        const query = await client.query(
            "UPDATE users SET civility = $1, lastname = $2, firstname = $3, email = $4, phone = $5, birthdate = $6, city = $7, postcode = $8, pseudo = $9, updated = CURRENT_TIMESTAMP WHERE id = $10 RETURNING id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, active, created, updated",
            [civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const remove = async (id) => {
    try {
        const query = await client.query(
            "DELETE FROM users WHERE id = $1 RETURNING id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo",
            [id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const active = async (id) => {
    try {
        const query = await client.query(
            "UPDATE users SET active = $1, updated = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, active, created, updated",
            [true, id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const deactive = async (id) => {
    try {
        const query = await client.query(
            "UPDATE users SET active = $1, updated = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, civility, lastname, firstname, email, phone, birthdate, city, postcode, pseudo, active, created, updated",
            [false, id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

module.exports = { selectAll, selectByID, selectByEmail, selectByPseudo, existingEmail, existingPseudo, create, update, updateProfile, remove, active, deactive };
