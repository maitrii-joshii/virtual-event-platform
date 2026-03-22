const { z } = require('zod');

const registerUserSchema = z.object({
    name: z
        .string({ message: "Invalid User Name" })
        .trim()
        .required({ message: "Name is required" })
        .min(1, { message: "User Name cannot be empty" }),
    email: z
        .trim()
        .required({ message: "Email is required" })
        .email({ message: "Invalid Email" }),
    password: z
        .string({ message: "Invalid Password" })
        .required({ message: "Password is required" })
        .min(6, { message: "Password must be atleast 6 characters long" }),
    role: z
        .enum(["organizer", "participant"], { message: "Invalid Role" })
});

const loginUserSchema = z.object({
    email: z
        .email({ message: "Invalid Email" }),
    password: z
        .string({ message: "Invalid Password" })
        .min(6, { message: "Password must be atleast 6 characters long" })
});


module.exports = {
    registerUserSchema,
    loginUserSchema
};