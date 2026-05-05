const express = require('express');
const router = express.Router();

const Auth = require('../controllers/Auth');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', Auth.Signup);
router.post('/signin', Auth.Signin);
router.get('/authme', authMiddleware.isLogged, Auth.authMe);
router.post('/logout', authMiddleware.isLogged, Auth.logout);
router.put('/updateprofile', authMiddleware.isLogged, Auth.updateProfile);

module.exports = router;