const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { eventSchema } = require('../schemas/eventSchema');
const { validateRequest } = require('../middleware/validateRequest');

// Routes for event management
router.get("", getEvents);
router.get("/:id", getEventById);
router.post("", validateRequest(eventSchema), createEvent);
router.put("/:id", validateRequest(eventSchema), updateEvent);
router.delete("/:id", deleteEvent);


module.exports = router;