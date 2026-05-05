const client = require('../db');

const selectByUserID = async (user_id) => {
    try {
        const query = await client.query(
            'SELECT * FROM stress_assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
            [user_id]
        );
        return query.rows;
    } catch (err) {
        console.error(err);
    }
};

const create = async (user_id, total_score, selected_events) => {
    try {
        const query = await client.query(
            'INSERT INTO stress_assessments (user_id, total_score, selected_events) VALUES ($1, $2, $3) RETURNING *',
            [user_id, total_score, JSON.stringify(selected_events)]
        );
        return query.rows[0];
    } catch (err) {
        console.error(err);
    }
};

module.exports = { selectByUserID, create };
