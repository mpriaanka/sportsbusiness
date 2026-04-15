const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/profile', authenticate, auth.getProfile);
router.get('/users', authenticate, authorize('admin'), auth.getUsers);

module.exports = router;
