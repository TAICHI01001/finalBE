"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryContent = void 0;
function newRepositoryContent(db) {
    return new RepositoryContent(db);
}
exports.newRepositoryContent = newRepositoryContent;
class RepositoryContent {
    constructor(db) {
        this.db = db;
    }
    async createContent(content) {
        return await this.db.content.create({
            data: {
                ...content,
                userId: undefined,
                user: {
                    connect: {
                        id: content.userId,
                    },
                },
            },
        });
    }
    async getContentById(contentId) {
        return await this.db.content.finUnique({
            where: {
                contentId,
            },
        });
    }
    async getContents() {
        return await this.db.content.findMany();
    }
}
//# sourceMappingURL=content.js.map