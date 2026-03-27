const InMemoryRepository = require('./inMemoryRepository');

class RegistrationRepository extends InMemoryRepository {
    constructor() {
        super();
    }

    // Find registrations by event ID
    findRegistrationsByEventId(eventId) {
        const result = [];

        for(const [id, registration] of this.storage) {
            if(registration.eventId == eventId) {
                result.push(registration);
            }
        }
        
        return result;
    };

    // Find registrations by user ID
    findRegistrationsByUserId(userId) {
        const result = [];

        for(const [id, registration] of this.storage) {
            if(registration.userId == userId) {
                result.push(registration);
            }
        }
        
        return result;
    };

    // Create a new registration
    createRegistration(eventId, data) {
        const registrationData = {
            ...data,
            eventId
        };

        return this.create(registrationData);
    };

    // Delete registration by Registration ID
    deleteRegistration(registrationId) {
        const registration = this.storage.get(Number(registrationId));

        if(!registration) {
            return false;
        }

        return this.delete(Number(registrationId));
    };
}


module.exports = new RegistrationRepository();