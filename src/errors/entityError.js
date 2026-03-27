const BaseError = require('./baseError');

class EntityNotFoundError extends BaseError {
    constructor(entityName) {
        super(`${entityName} not found`, 404);
    }
};


module.exports = { EntityNotFoundError };