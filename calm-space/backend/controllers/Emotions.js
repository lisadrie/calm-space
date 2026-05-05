const Emotions = require('../models/Emotions');

const getEmotions = async (req, res) => {
    try {
        const emotions = await Emotions.selectByUserID(req.user.id);
        res.status(200).json(emotions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createEmotion = async (req, res) => {
    const { emotion, emoji, color } = req.body;
    try {
        if (!emotion) return res.status(400).json({ error: "L'émotion est requise." });
        const newEmotion = await Emotions.create(req.user.id, emotion, emoji, color);
        res.status(201).json(newEmotion);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteEmotion = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Emotions.remove(id, req.user.id);
        if (!deleted) return res.status(404).json({ error: 'Émotion introuvable.' });
        res.status(200).json(deleted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getEmotions, createEmotion, deleteEmotion };
