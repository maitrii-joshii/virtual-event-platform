const InMemoryRepository = require('./inMemoryRepository');

class EventRepository extends InMemoryRepository {
    constructor() {
        super();
    }

    // Find events by date
    findByDate(date) {
        const result = [];
        for(const [id, event] of this.storage) {
            if(event.date == date) {
                result.push(event);
            }
        }
        return result;
    };
}


module.exports = new EventRepository();