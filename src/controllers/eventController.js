const getEvents = async(req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            events: data,
            message: "Events retrieved successfully"
        });
    } catch(err) {
        next(err);
    }
};

const getEventById = async(req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            events: data,
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
            location
        } = req.body;
        return res.status(201).json({
            success: true,
            events: data,
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
            location
        } = req.body;
        return res.status(200).json({
            success: true,
            events: data,
            message: "Event updated successfully"
        });
    } catch(err) {
        next(err);
    }
};

const deleteEvent = async(req, res, next) => {
    try {
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