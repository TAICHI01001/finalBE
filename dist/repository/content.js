"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryContent = void 0;
function newRepositoryContent(repo) {
    return new RepositoryContent(repo);
}
exports.newRepositoryContent = newRepositoryContent;
const includePostedBy = {
    postedBy: {
        select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
            password: false,
        },
    },
};
class RepositoryContent {
    constructor(repo) {
        this.repo = repo;
    }
    async createContent(content) {
        return await this.repo.content.create({
            include: includePostedBy,
            data: {
                ...content,
                userId: undefined,
                postedBy: {
                    connect: {
                        id: content.userId,
                    },
                },
            },
        });
    }
    async getContentById(id) {
        return await this.repo.content.findUnique({
            include: includePostedBy,
            where: {
                id: id,
            },
        });
    }
    async getContent() {
        return await this.repo.content.findMany({
            include: {
                postedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        registeredAt: true,
                        password: false,
                    },
                },
            },
        });
    }
    async updateContent(where, data) {
        return await this.repo.content
            .update({ include: includePostedBy, where, data })
            .catch((err) => {
            return Promise.reject(`failed to update content ${where} with data ${data}`);
        });
    }
    async deleteContent(where) {
        return await this.repo.content
            .delete({
            include: includePostedBy,
            where: where,
        })
            .then((content) => Promise.resolve(content))
            .catch((err) => Promise.reject(`failed to delate content ${where.id} : ${err}`));
    }
    async getUserContents(userId) {
        return await this.repo.content.findMany({ where: { userId } });
    }
    async deleteUserContentById(arg) {
        const content = await this.repo.content.findFirst({
            where: { id: arg.id, userId: arg.userId },
        });
        if (!content) {
            return Promise.reject(`no such content ${arg.id} not found`);
        }
        return this.repo.content.delete({ where: { id: arg.id } });
    }
}
//# sourceMappingURL=content.js.map