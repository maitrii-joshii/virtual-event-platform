const registerUser = async(req, res, next) => {
    try {
        res.send("User registration successful");
    } catch(err) {
        next(err);
    }
};

const loginUser = async(req, res, next) => {
    try {
        res.send("User login successful");
    } catch(err) {
        next(err);
    }
};


module.exports = {
    registerUser,
    loginUser
};