const Favorites = require('../models/Favorites');

const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorites.selectByUserID(req.user.id);
        res.status(200).json(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createFavorite = async (req, res) => {
    const { fact_text, fact_type } = req.body;
    try {
        if (!fact_text) return res.status(400).json({ error: 'Le texte du fait est requis.' });
        if (!fact_type) return res.status(400).json({ error: 'Le type de fait est requis.' });
        const newFavorite = await Favorites.create(req.user.id, fact_text, fact_type);
        res.status(201).json(newFavorite);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteFavorite = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Favorites.remove(id, req.user.id);
        if (!deleted) return res.status(404).json({ error: 'Favori introuvable.' });
        res.status(200).json(deleted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getFavorites, createFavorite, deleteFavorite };
