const express = require('express');
const router = express.Router();

const EmotionsController = require('../controllers/Emotions');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.isLogged, EmotionsController.getEmotions);
router.post('/', authMiddleware.isLogged, EmotionsController.createEmotion);
router.delete('/:id', authMiddleware.isLogged, EmotionsController.deleteEmotion);

module.exports = router;
