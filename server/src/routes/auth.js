const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    login,
    register,
    getMe
} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', protect, authorize('admin'), register);
router.get('/me', protect, getMe);

module.exports = router;
