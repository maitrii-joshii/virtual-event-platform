const registrationRepository = require('../repositories/registrationRepository');
const { ForbiddenError } = require('../errors/authError');
const { EntityNotFoundError } = require('../errors/entityError');
const eventService = require('./eventService');
const { sendRegistrationConfirmationEmail } = require('./mailService');
const e = require('express');

class RegistrationService {
    //  Get all registrations for an event
    getEventRegistrations = async(eventId) => {
        const registrationsIterator = await registrationRepository.findRegistrationsByEventId(eventId);
        const registrations = Array.from(registrationsIterator);

        return registrations;
    };

    // Get an existing registration for an event
    getEventRegistration = async(eventId, registrationId, attendee) => {
        const registration = await registrationRepository.getById(Number(registrationId));

        if(!registration) {
            throw new EntityNotFoundError("Registration");
        }

        if(registration.eventId !== Number(eventId)) {
            throw new EntityNotFoundError("Registration");
        }

        if(registration.userId !== attendee) {
            throw new ForbiddenError("You are not authorized to view this registration");
        }

        return registration;
    };

    // Get all registrations for a user
    getUserRegistrations = async(userId) => {
        const registrationsIterator = await registrationRepository.findRegistrationsByUserId(userId);
        const registrations = Array.from(registrationsIterator);

        return registrations;
    }

    // Create a new registration for an event
    createEventRegistration = async(eventId, userId, ticketType, notes, userEmail, userName) => {
        const event = await eventService.getEventById(eventId);
        const registrationEntity = {
            eventId: Number(eventId),
            userId: userId,
            ticketType: ticketType,
            notes: notes
        }
        const registration = await registrationRepository.create(registrationEntity);

        // Send confirmation email
        await sendRegistrationConfirmationEmail(userEmail, userName, event.title);

        return registration;
    };

    // Delete an existing registration for an event
    deleteEventRegistration = async(eventId, registrationId, deletedBy) => {
        const registration = await registrationRepository.getById(Number(registrationId));

        if(!registration) {
            throw new EntityNotFoundError("Registration");
        }

        if(registration.eventId !== Number(eventId)) {
            throw new EntityNotFoundError("Registration");
        }

        if(registration.userId !== deletedBy) {
            throw new ForbiddenError("You are not authorized to delete this registration");
        }

        const isDeleted = await registrationRepository.deleteRegistration(registrationId);

        return isDeleted;
    };
}


module.exports = new RegistrationService();