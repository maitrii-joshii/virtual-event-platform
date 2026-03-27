const authService = require('../services/authService');

const registerUser = async(req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;
        const user = await authService.registerUser(name, email, password, role);

        return res.status(201).json({
            success: true,
            user: user,
            message: "User registered successfully"
        });
    } catch(err) {
        next(err);
    }
};

const loginUser = async(req, res, next) => {
    try {
        const {
            email,
            password,
            role
        } = req.body;
        const token = await authService.loginUser(email, password, role);
        
        return res.status(200).json({
            success: true,
            token: token,
            message: "User logged in successfully"
        });
    } catch(err) {
        next(err);
    }
};


module.exports = {
    registerUser,
    loginUser
};