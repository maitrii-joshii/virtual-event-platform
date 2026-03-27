const express = require('express');
const router = express.Router();
const { getEventRegistrations, getEventRegistration, getUserRegistrations, createEventRegistration, deleteEventRegistration } = require('../controllers/registrationController');
const { createEventRegistrationSchema } = require('../schemas/registrationSchema');
const { validateRequest } = require('../middleware/validateRequest');
const { validateJWT, validateUserRole } = require('../middleware/authMiddleware');

// Apply JWT validation middleware to all routes in this router
router.use(validateJWT);

// Routes for event registrations
router.get("/events/:eventId/registrations", validateUserRole('organizer'), getEventRegistrations);
router.get("/events/:eventId/registrations/:registrationId", getEventRegistration);
router.get("/registrations", validateUserRole('attendee'), getUserRegistrations);
router.post("/events/:eventId/registrations", validateUserRole('attendee'), validateRequest(createEventRegistrationSchema), createEventRegistration);
router.delete("/events/:eventId/registrations/:registrationId", validateUserRole('attendee'), deleteEventRegistration);

module.exports = router;