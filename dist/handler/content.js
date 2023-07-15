"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerContent = void 0;
function newHandlerContent(repo) {
    return new HandlerContent(repo);
}
exports.newHandlerContent = newHandlerContent;
class HandlerContent {
    constructor(repo) {
        this.repo = repo;
    }
    async createContent(req, res) {
        const videoUrl = req.body;
        if (!videoUrl) {
            return res.status(400).json().end();
        }
        return this.repo
            .createContent(videoUrl)
            .then((content) => res.status(201).json(content).end());
    }
    async getContent(req, res) {
        return this.repo
            .getContent()
            .then((content) => res.status(200).json(content).end())
            .catch((err) => {
            console.log(`${err}`);
            return res.status(500).json().end();
        });
    }
    async getContentById(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json(`${req.params.id}`).end();
        }
        return this.repo
            .getContentById(id)
            .then((content) => {
            if (!content) {
                return res.status(404).json().end();
            }
            return res.status(200).json().end();
        })
            .catch((err) => {
            return res.status(500).json(`${err}`).end();
        });
    }
}
//# sourceMappingURL=content.js.map