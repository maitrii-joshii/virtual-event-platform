const { z } = require('zod');

const eventSchema = z.object({
    title: z
        .trim()
        .required({ message: "Title is required" })
        .min(1, { message: "Title cannot be empty" }),
    description: z
        .trim()
        .required({ message: "Description is required" })
        .min(10, { message: "Description must be at least 10 characters long" }),
    date: z
        .date({ message: "Invalid Date" })
        .required({ message: "Date is required" }),
    time: z
        .time({ message: "Invalid Time" })
        .required({ message: "Time is required" }),
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
        { message: "Invalid Location" })
        .required({ message: "Location is required" }),
});

module.exports = {
    eventSchema
};