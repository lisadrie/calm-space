const express = require('express');
const router = express.Router();

const FavoritesController = require('../controllers/Favorites');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.isLogged, FavoritesController.getFavorites);
router.post('/', authMiddleware.isLogged, FavoritesController.createFavorite);
router.delete('/:id', authMiddleware.isLogged, FavoritesController.deleteFavorite);

module.exports = router;
