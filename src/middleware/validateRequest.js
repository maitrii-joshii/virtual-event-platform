const { InvalidRequestParamsError } = require('../errors/requestError');

const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if(!result.success) {
        throw new InvalidRequestParamsError();
    } else {
        next();
    }
}


module.exports = { validateRequest };