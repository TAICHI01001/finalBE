"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerContent = void 0;
const _1 = require(".");
function newHandlerContent(repo) {
    return new HandlerContent(repo);
}
exports.newHandlerContent = newHandlerContent;
class HandlerContent {
    constructor(repo) {
        this.repo = repo;
    }
    async createContent(req, res) {
        const createContent = req.body;
        if (!createContent.videoUrl) {
            return res.status(400).json({ error: "missing videoUrl in body" }).end();
        }
        try {
            const details = await (0, _1.getVideoDetails)(createContent.videoUrl);
            const userId = req.payload.id;
            const createdContent = await this.repo.createContent({
                ...details,
                userId,
                ...createContent,
            });
            return res.status(201).json(createdContent).end();
        }
        catch (err) {
            const errMsg = "failed to create content";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async getContent(req, res) {
        try {
            const contents = await this.repo.getContent();
            return res.status(200).json(contents).end();
        }
        catch (err) {
            const errMsg = `failed to get contents`;
            console.error(`${errMsg}: ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async getContentById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: "missing id in params" }).end();
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id '${id}' is not number` })
                .end();
        }
        try {
            const content = await this.repo.getContentById(id);
            if (!content) {
                return res
                    .status(404)
                    .json({ error: `no such content: ${id}` })
                    .end();
            }
            return res.status(200).json().end();
        }
        catch (err) {
            const errMsg = `failed to get todo ${id}`;
            console.error(`${errMsg}: ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async updateContent(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: `missing id in params` }).end();
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id '${id}' in not number` })
                .end();
        }
        let rating = req.body.rating;
        let comment = req.body.comment;
        if (!comment || comment === "") {
            comment = undefined;
        }
        try {
            const updated = await this.repo.updateContent({ id, userId: req.payload.id }, { rating, comment });
            return res.status(200).json(updated).end();
        }
        catch (err) {
            const errMsg = `failed to update content ${id}`;
            console.error(`${errMsg} : ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async delateContent(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: `missing id in params ` });
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id '${id}' is not number` })
                .end();
        }
        try {
            const userId = req.payload.id;
            const deleted = await this.repo.deleteContent({
                id,
                userId,
            });
            return res.status(200).json(deleted).end();
        }
        catch (err) {
            const errMsg = `failed to delete content : ${id}`;
            console.error(`${errMsg} : ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async getUserContents(req, res) {
        return this.repo
            .getUserContents(req.payload.id)
            .then((contents) => res.status(200).json(contents).end())
            .catch((err) => {
            console.error(`failed to get contents: ${err}`);
            return res.status(500).json({ error: `failed to get contents` }).end();
        });
    }
}
//   async createContent(
//     req:  AuthRequest<{}, ICreateContent>,
//     res: Response
//   ): Promise<Response> {
//     const createContent: ICreateContent = req.body;
//     if (!createContent.videoUrl) {
//       return res.status(400).json().end();
//     }
//     try {
//       const details = await getVideoDetails(createContent.videoUrl);
//       const userId = req.payload.id;
//       const create = await this.repo.createContent({
//         ...details,
//         userId,
//         ...createContent,
//       });
//       return res.status(200).json().end();
//     } catch (err) {
//       return res.status(500).json().end();
//     }
//   }
//   async getContent(
//     req: AuthRequest<{}, {}>,
//     res: Response
//   ): Promise<Response> {
//     try {
//       const contents = await this.repo.getContent();
//       return res.status(200).json(`${contents}`).end();
//     } catch (err) {
//       return res.status(500).json().end();
//     }
//   }
//   async getContentById(
//     req: AuthRequest<any,any>,
//     res: Response
//   ): Promise<Response> {
//     if (!req.params.id) {
//       return res.status(404).json().end();
//     }
//     const id = Number(req.params.id);
//     if (isNaN(id)) {
//       return res
//         .status(404)
//         .json({ error: `id '${id}' is not number` })
//         .end();
//     }
//     try {
//       const contents = await this.repo.getContentById(id);
//       if (!contents) {
//         return res.status(404).json().end();
//       }
//       return res.status(200).json().end();
//     }
//     catch (err) {
//       console.error(`${err}`);
//       return res.status(500).json().end();
//   }
// }
//   async getContent(
//     req: JwtAuthRequest<Request, any>,
//     res: Response
//   ): Promise<Response> {
//     return this.repo
//       .getContent()
//       .then((content) => res.status(200).json(content).end())
//       .catch((err) => {
//         console.log(`${err}`);
//         return res.status(500).json().end();
//       });
//   }
//   async getContentById(
//     req: JwtAuthRequest<WithId, any>,
//     res: Response
//   ): Promise<Response> {
//     const id = Number(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json(`${req.params.id}`).end();
//     }
//     return this.repo
//       .getContentById(id)
//       .then((content) => {
//         if (!content) {
//           return res.status(404).json().end();
//         }
//         return res.status(200).json().end();
//       })
//       .catch((err) => {
//         return res.status(500).json(`${err}`).end();
//       });
//   }
// }
//# sourceMappingURL=content.js.map