class UserService {
    constructor() {
        this.users = {};
    }

    createUser(id, userData) {
        this.users[id] = userData;
    }

    getUser(id) {
        return this.users[id];
    }

    deleteUser(id) {
        delete this.users[id];
    }
}

export { UserService };
