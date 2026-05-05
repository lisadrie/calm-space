const client = require('../db');

const selectByUserID = async (user_id) => {
    try {
        const query = await client.query(
            'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        );
        return query.rows;
    } catch (err) {
        console.error(err);
    }
};

const create = async (user_id, fact_text, fact_type) => {
    try {
        const query = await client.query(
            'INSERT INTO favorites (user_id, fact_text, fact_type) VALUES ($1, $2, $3) RETURNING *',
            [user_id, fact_text, fact_type]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

const remove = async (id, user_id) => {
    try {
        const query = await client.query(
            'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user_id]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

module.exports = { selectByUserID, create, remove };
