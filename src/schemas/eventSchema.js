const { z } = require('zod');

const eventSchema = z.object({
    title: z
        .string({ message: "Invalid Title" })
        .trim()
        .min(1, { message: "Title cannot be empty" }),
    description: z
        .string({ message: "Invalid Description" })
        .trim()
        .min(10, { message: "Description must be at least 10 characters long" }),
    date: z
        .string({ message: "Invalid Date" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 
            { message: "Invalid Date format (YYYY-MM-DD)" 
        }),
    time: z
        .string({ message: "Invalid Time" })        
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Invalid Time format (HH:mm)"
        }),
    location: z
        .enum([
            "Ahmedabad",
            "Mumbai",
            "Delhi",
            "Bengaluru",
            "Hyderabad",
            "Chennai",
            "Pune",
            "Kolkata",
            "Jaipur",
            "Surat"
        ], 
        { message: "Invalid Location" }),
    participants: z
        .array(z
            .string()
            .trim()
            .min(1, "Participant name cannot be empty"))
        .min(1, "At least one participant is required")
});

module.exports = {
    eventSchema
};