const express = require('express');
const router = express.Router();
const { getEventRegistrations, getEventParticipants, createEventRegistration, deleteEventRegistration } = require('../controllers/registrationController');
const { createEventRegistrationSchema } = require('../schemas/registrationSchema');
const { validateRequest } = require('../middleware/validateRequest');

// Routes for event registrations
router.get("/events/:eventId/registrations", getEventRegistrations);
router.get("/events/:eventId/participants", getEventParticipants);
router.post("/events/:eventId/registrations", validateRequest(createEventRegistrationSchema), createEventRegistration);
router.delete("/events/:eventId/registrations/:participantId", deleteEventRegistration);


module.exports = router;