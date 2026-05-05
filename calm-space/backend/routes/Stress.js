const express = require('express');
const router = express.Router();

const StressController = require('../controllers/Stress');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.isLogged, StressController.getAssessments);
router.post('/', authMiddleware.isLogged, StressController.createAssessment);

module.exports = router;
