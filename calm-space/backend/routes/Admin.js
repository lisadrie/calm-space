const express = require('express');
const router = express.Router();
const Admin = require('../controllers/Admin');
const authMiddleware = require('../middlewares/authMiddleware');

const guard = [authMiddleware.isLogged, authMiddleware.isSuperAdmin];

router.get('/stats',              ...guard, Admin.getStats);
router.get('/activity',           ...guard, Admin.getActivity);
router.get('/users',              ...guard, Admin.getAllUsers);
router.put('/users/:id/active',   ...guard, Admin.activateUser);
router.put('/users/:id/deactive', ...guard, Admin.deactivateUser);
router.delete('/users/:id',       ...guard, Admin.deleteUser);
router.put('/users/:id/role',     ...guard, Admin.changeRole);

module.exports = router;
