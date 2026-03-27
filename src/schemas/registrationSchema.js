const { z } = require('zod');

const createEventRegistrationSchema = z.object({
    ticketType: z
        .enum(["General", "VIP", "Student"], { message: "Invalid Ticket type" }),
    notes: z
        .string({ message: "Invalid Notes" })
        .trim()
        .min(10, { message: "Notes must be at least 10 characters long" })
});

module.exports = {
    createEventRegistrationSchema
};