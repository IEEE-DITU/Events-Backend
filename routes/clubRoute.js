const express = require('express');
const { getAllClubs, getClubById, addNewClub, updateClub } = require('../controllers/clubController');
const authenticateToken = require('../middleware/authToken');

const router = express.Router();

router.get('/', authenticateToken, getAllClubs);
router.get('/:id', authenticateToken, getClubById);
router.post('/', authenticateToken, addNewClub);
router.put('/:id', authenticateToken, updateClub);

module.exports = router;
