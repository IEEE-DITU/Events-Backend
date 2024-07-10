const express = require('express');
const {getAllEvents,addNewEvent,updateEvent,deleteEvent,getEventById} = require('../controllers/eventController');
const authenticateToken = require('../middleware/authToken');
const router = express.Router();

router.get('/', getAllEvents);
router.post('/',authenticateToken, addNewEvent);
router.put('/:id',authenticateToken, updateEvent);
router.delete('/:id',authenticateToken, deleteEvent);
router.get('/:id', getEventById);

module.exports = router;