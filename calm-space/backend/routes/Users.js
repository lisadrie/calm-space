const express = require('express');
const router = express.Router();

const Users = require('../controllers/Users');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/users', authMiddleware.isLogged, authMiddleware.isSuperAdmin, Users.selectAllUsers);
router.get('/users/:id', authMiddleware.isLogged, authMiddleware.isSuperAdmin, Users.selectUserByID);
router.post('/users', authMiddleware.isLogged, authMiddleware.isSuperAdmin, Users.createUser);
router.put('/users/:id', authMiddleware.isLogged, authMiddleware.isSuperAdmin, Users.updateUser);
router.delete('/users/:id', authMiddleware.isLogged, authMiddleware.isSuperAdmin, Users.removeUser);
router.put('/users/active/:id', authMiddleware.isLogged, authMiddleware.isSuperAdmin, Users.activeUser);
router.put('/users/deactive/:id', authMiddleware.isLogged, authMiddleware.isSuperAdmin, Users.deactiveUser);

module.exports = router;