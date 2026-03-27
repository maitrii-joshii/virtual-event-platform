const registrationService = require('../services/registrationService');

const getEventRegistrations = async(req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const registrations = await registrationService.getEventRegistrations(eventId);

        return res.status(200).json({
            success: true,
            registrations: registrations,
            message: "Event registrations retrieved successfully"
        });
    } catch(err) {
        next(err);
    }
};

const getEventRegistration = async(req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const registrationId = req.params.registrationId;
        const registration = await registrationService.getEventRegistration(eventId, registrationId, req.user.id);       

        return res.status(200).json({
            success: true,
            registration: registration,
            message: "Event registration retrieved successfully"
        });
    } catch(err) {
        next(err);
    }
};

const getUserRegistrations = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const registrations = await registrationService.getUserRegistrations(userId);

        return res.status(200).json({
            success: true,
            registrations: registrations,
            message: "User registrations retrieved successfully"
        });
    } catch(err) {
        next(err);
    }
};

const createEventRegistration = async(req, res, next) => {
    try {
        const {
            ticketType,
            notes
        } = req.body;
        const eventId = req.params.eventId;
        const userId = req.user.id;
        const userEmail = req.user.email;
        const userName = req.user.name;
        const registration = await registrationService.createEventRegistration(eventId, userId, ticketType, notes, userEmail, userName);

        return res.status(201).json({
            success: true,
            registration: registration,
            message: "Event registration created successfully"
        });
    } catch(err) {
        next(err);
    }
};

const deleteEventRegistration = async(req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const registrationId = req.params.registrationId;
        await registrationService.deleteEventRegistration(eventId, registrationId, req.user.id);

        return res.status(204).send();
    } catch(err) {
        next(err);
    }
};


module.exports = {
    getEventRegistrations,
    getEventRegistration,
    getUserRegistrations,
    createEventRegistration,
    deleteEventRegistration
};