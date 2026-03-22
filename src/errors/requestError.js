const BaseError = require('./baseError');

class InvalidRequestParamsError extends BaseError {
    constructor() {
        super("Invalid Request Parameters", 400);
    }
}


module.exports = { InvalidRequestParamsError };