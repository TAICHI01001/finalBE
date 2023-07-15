"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryUser = void 0;
function newRepositoryUser(db) {
    return new RepositoryUser(db);
}
exports.newRepositoryUser = newRepositoryUser;
class RepositoryUser {
    constructor(db) {
        this.db = db;
    }
    async createUser(user) {
        return await this.db.user
            .create({
            data: user,
        })
            .catch((err) => {
            Promise.reject(`${err}`);
        });
    }
    async getUser(username) {
        return await this.db.user.finUnique({ where: { username } });
    }
}
//# sourceMappingURL=user.js.map