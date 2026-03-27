const InMemoryRepository = require('./inMemoryRepository');

class UserRepository extends InMemoryRepository {
    constructor() {
        super();
    }

    // Find a user by email
    findByEmail(email) {
        for(const [id, user] of this.storage) {
            if(user.email == email) {
                return user;
            }
        }
        
        return null;
    };

    // Find a user by email and role
    findByEmailAndRole(email, role) {
        for(const [id, user] of this.storage) {
            if(user.email == email && user.role == role) {
                return user;
            }
        }
        
        return null;
    };
}


module.exports = new UserRepository();