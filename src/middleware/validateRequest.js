const { InvalidRequestParamsError } = require('../errors/requestError');

const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if(!result.success) {
        const errors = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        throw new InvalidRequestParamsError(errors);
    } else {
        next();
    }
}


module.exports = { validateRequest };