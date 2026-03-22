const registerUser = async(req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;
        return res.status(201).json({
            success: true,
            data: user,
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
            password
        } = req.body;
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