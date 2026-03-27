const eventRepository = require('../repositories/eventRepository');
const { ForbiddenError } = require('../errors/authError');
const { EntityNotFoundError } = require('../errors/entityError');

class EventService {
    // Get all events
    getEvents = async() => {
        const eventsIterator = await eventRepository.getAll();
        const events = Array.from(eventsIterator);

        return events;
    };

    // Get event by ID
    getEventById = async(eventId) => {
        const event = await eventRepository.getById(Number(eventId));

        if (!event) {
            throw new EntityNotFoundError("Event");
        }

        return event;
    };

    // Create a new event
    createEvent = async(title, description, date, time, location, participants, createdBy) => {
        const eventEntity = {
            title: title,
            description: description,
            date: date,
            time: time,
            location: location,
            participants: participants,
            createdBy: createdBy
        }
        const event = await eventRepository.create(eventEntity);

        return event;
    };

    // Update an existing event
    updateEvent = async(eventId, title, description, date, time, location, participants, updatedBy) => {
        const event = await eventRepository.getById(Number(eventId));
        
        if(event.createdBy !== updatedBy) {
            throw new ForbiddenError("You are not authorized to update this event");
        }
        
        const eventEntity = {
            title: title,
            description: description,
            date: date,
            time: time,
            location: location,
            participants: participants
        }
        const updatedEvent = await eventRepository.update(Number(eventId), eventEntity);

        return updatedEvent;
    };

    // Delete an existing event
    deleteEvent = async(eventId, deletedBy) => {
        const event = await eventRepository.getById(Number(eventId));

        if (!event) {
            throw new EntityNotFoundError("Event");
        }

        if(event.createdBy !== deletedBy) {
            throw new ForbiddenError("You are not authorized to delete this event");
        }

        const isDeleted = await eventRepository.delete(Number(eventId));

        return isDeleted;
    };
}


module.exports = new EventService();