const { z } = require('zod');

const registerUserSchema = z.object({
    name: z
        .string({ message: "Invalid User Name" })
        .trim()
        .min(1, { message: "User Name cannot be empty" }),
    email: z
        .email({ message: "Invalid Email" }),
    password: z
        .string({ message: "Invalid Password" })
        .min(6, { message: "Password must be atleast 6 characters long" }),
    role: z
        .enum(["organizer", "attendee"], { message: "Invalid Role" })
});

const loginUserSchema = z.object({
    email: z
        .email({ message: "Invalid Email" }),
    password: z
        .string({ message: "Invalid Password" })
        .min(6, { message: "Password must be atleast 6 characters long" }),
    role: z
        .enum(["organizer", "attendee"], { message: "Invalid Role" })
});


module.exports = {
    registerUserSchema,
    loginUserSchema
};