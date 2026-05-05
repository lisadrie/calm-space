const client = require("../db");

const selectAll = async () => {
    try {
        const query = await client.query(
            "SELECT a.*, u.lastname, u.firstname, u.email, u.active, u.created, u.updated FROM moderators a LEFT JOIN users u ON a.user_id = u.id"
        );
        return query.rows;
    } catch (err) {
        console.error(err);
    }
};

const selectByUserID = async (user_id) => {
    try {
        const query = await client.query(
            "SELECT a.*, u.lastname, u.firstname, u.email, u.active, u.created, u.updated FROM moderators a LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = $1",
            [user_id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const create = async (user_id) => {
    try {
        const query = await client.query(
            "INSERT INTO moderators (user_id) VALUES ($1) RETURNING user_id",
            [user_id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const remove = async (user_id) => {
    try {
        const query = await client.query(
            "DELETE FROM moderators WHERE user_id = $1 RETURNING user_id",
            [user_id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

module.exports = { selectAll, selectByUserID, create, remove };