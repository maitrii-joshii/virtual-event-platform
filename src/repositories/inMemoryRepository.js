class InMemoryRepository {
    constructor() {
        this.storage = new Map();
        this.currentId = 1;
    }

    // Create a new record
    create(data) {
        data.id = this.currentId;
        this.storage.set(data.id, data);
        this.currentId++;
        return data;
    };

    // Update an existing record by ID
    update(id, data) {
        const existing = this.storage.get(id);
        if(!existing) {
            return null;
        }

        const updated = { ...existing, ...data, id };
        this.storage.set(id, updated);
        return updated;
    };

    // Retrieve a record by ID
    getById(id) {
        return this.storage.get(id) || null;
    };

    // Retrieve all records
    getAll() {
        return this.storage.values();
    };
    
    // Delete a record by ID
    delete(id) {
        return this.storage.delete(id);
    };
}


module.exports = InMemoryRepository;