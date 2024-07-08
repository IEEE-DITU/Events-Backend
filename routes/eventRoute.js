const express = require('express');
const {getAllEvents,addNewEvent,updateEvent,deleteEvent,getEventById} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', addNewEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id', getEventById);

module.exports = router;