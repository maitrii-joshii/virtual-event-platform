const getEventRegistrations = async(req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            events: data,
            message: "Events registrations retrieved successfully"
        });
    } catch(err) {
        next(err);
    }
};

const getEventParticipants = async(req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            events: data,
            message: "Event participants retrieved successfully"
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
        return res.status(201).json({
            success: true,
            events: data,
            message: "Event registration created successfully"
        });
    } catch(err) {
        next(err);
    }
};

const deleteEventRegistration = async(req, res, next) => {
    try {
        return res.status(204).send();
    } catch(err) {
        next(err);
    }
};


module.exports = {
    getEventRegistrations,
    getEventParticipants,
    createEventRegistration,
    deleteEventRegistration
};