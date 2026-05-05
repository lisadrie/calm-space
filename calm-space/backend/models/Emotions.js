const client = require('../db');

const selectByUserID = async (user_id) => {
    try {
        const query = await client.query(
            'SELECT * FROM emotions WHERE user_id = $1 ORDER BY logged_at DESC',
            [user_id]
        );
        return query.rows;
    } catch (err) {
        console.error(err);
    }
};

const create = async (user_id, emotion, emoji, color) => {
    try {
        const query = await client.query(
            'INSERT INTO emotions (user_id, emotion, emoji, color) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, emotion, emoji, color]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const remove = async (id, user_id) => {
    try {
        const query = await client.query(
            'DELETE FROM emotions WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user_id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

module.exports = { selectByUserID, create, remove };
