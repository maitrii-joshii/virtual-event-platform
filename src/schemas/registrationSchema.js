const { z } = require('zod');

const createEventRegistrationSchema = z.object({
    ticketType: z
        .enum(["General", "VIP", "Student"], { message: "Invalid Ticket type" })
        .required({ message: "Ticket type is required" }),
    notes: z
        .trim()
        .required({ message: "Notes are required" })
        .min(10, { message: "Notes must be at least 10 characters long" })
});

module.exports = {
    createEventRegistrationSchema
};