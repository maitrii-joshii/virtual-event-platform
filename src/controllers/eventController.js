const eventService = require('../services/eventService');

const getEvents = async(req, res, next) => {
    try {
        const events = await eventService.getEvents();

        return res.status(200).json({
            success: true,
            events: events,
            message: "Events retrieved successfully"
        });

    } catch(err) {
        next(err);
    }
};

const getEventById = async(req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        
        return res.status(200).json({
            success: true,
            event: event,
            message: "Event retrieved successfully"
        });
    } catch(err) {
        next(err);
    }
};

const createEvent = async(req, res, next) => {
    try {
        const {
            title,
            description,
            date,
            time,
            location,
            participants
        } = req.body;
        const createdBy = req.user.id;
        const event = await eventService.createEvent(title, description, date, time, location, participants, createdBy);

        return res.status(201).json({
            success: true,
            event: event,
            message: "Event created successfully"
        });
    } catch(err) {
        next(err);
    }
};

const updateEvent = async(req, res, next) => {
    try {
        const {
            title,
            description,
            date,
            time,
            location,
            participants
        } = req.body;
        const eventId = req.params.id;
        const event = await eventService.updateEvent(eventId, title, description, date, time, location, participants, req.user.id);

        return res.status(200).json({
            success: true,
            event: event,
            message: "Event updated successfully"
        });
    } catch(err) {
        next(err);
    }
};

const deleteEvent = async(req, res, next) => {
    try {
        await eventService.deleteEvent(req.params.id, req.user.id);
        return res.status(204).send();
    } catch(err) {
        next(err);
    }
};


module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};