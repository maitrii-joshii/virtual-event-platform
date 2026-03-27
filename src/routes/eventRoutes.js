const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { eventSchema } = require('../schemas/eventSchema');
const { validateRequest } = require('../middleware/validateRequest');
const { validateJWT, validateUserRole } = require('../middleware/authMiddleware');

// Apply JWT validation middleware to all routes in this router
router.use(validateJWT);

// Routes for event management
router.get("", getEvents);
router.get("/:id", getEventById);
router.post("", validateUserRole('organizer'), validateRequest(eventSchema), createEvent);
router.put("/:id", validateUserRole('organizer'), validateRequest(eventSchema), updateEvent);
router.delete("/:id", validateUserRole('organizer'), deleteEvent);


module.exports = router;