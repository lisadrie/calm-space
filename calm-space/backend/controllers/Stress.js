const StressAssessments = require('../models/StressAssessments');

const getAssessments = async (req, res) => {
    try {
        const assessments = await StressAssessments.selectByUserID(req.user.id);
        res.status(200).json(assessments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createAssessment = async (req, res) => {
    const { total_score, selected_events } = req.body;
    try {
        if (total_score === undefined || total_score === null) {
            return res.status(400).json({ error: 'Le score total est requis.' });
        }
        const assessment = await StressAssessments.create(req.user.id, total_score, selected_events || []);
        res.status(201).json(assessment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getAssessments, createAssessment };
