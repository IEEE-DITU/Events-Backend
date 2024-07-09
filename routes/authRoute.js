const express = require('express');
const {registerUser, loginUser, forgotPassword, getUserById} = require('../controllers/authController');
const authenticateToken = require('../middleware/authToken');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/user/:id', authenticateToken, getUserById);
module.exports = router;