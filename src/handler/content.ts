import { Response } from "express";
import { IRepositoryContent } from "../repository";
import { IHandlerContent, WithContent } from ".";
import { AuthRequest } from "../auth/jwt";
import { ICreateContentDto } from "../entities";
import { getVideoDetails } from ".";

export function newHandlerContent(repo: IRepositoryContent): IHandlerContent {
  return new HandlerContent(repo);
}

class HandlerContent implements IHandlerContent {
  private repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }
  async createContent(
    req: AuthRequest<Request, WithContent>,
    res: Response
  ): Promise<Response> {
    const createContent: ICreateContentDto = req.body;
    if (!createContent.videoUrl) {
      return res.status(400).json({ error: "missing videoUrl in body" }).end();
    }

    try {
      const details = await getVideoDetails(createContent.videoUrl);
      const userId = req.payload.id;

      const createdContent = await this.repo.createContent({
        ...details,
        userId, // @TODO: use JWT middleware
        ...createContent,
      });

      return res.status(201).json(createdContent).end();
    } catch (err) {
      const errMsg = "failed to create content";
      console.error(`${errMsg} ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }
  async getContent(
    req: AuthRequest<any, any>,
    res: Response
  ): Promise<Response> {
    try {
      const contents = await this.repo.getContent();

      return res.status(200).json(contents).end();
    } catch (err) {
      const errMsg = `failed to get contents`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getContentById(
    req: AuthRequest<any, any>,
    res: Response
  ): Promise<Response> {
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
    } catch (err) {
      const errMsg = `failed to get todo ${id}`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async updateContent(
    req: AuthRequest<any, any>,
    res: Response
  ): Promise<Response> {
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

    let rating: number | undefined = req.body.rating;
    let comment: string | undefined = req.body.comment;
    if (!comment || comment === "") {
      comment = undefined;
    }
    try {
      const updated = await this.repo.updateContent(
        { id, userId: req.payload.id },
        { rating, comment }
      );

      return res.status(200).json(updated).end();
    } catch (err) {
      const errMsg = `failed to update content ${id}`;
      console.error(`${errMsg} : ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async delateContent(
    req: AuthRequest<any, any>,
    res: Response
  ): Promise<Response> {
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
    } catch (err) {
      const errMsg = `failed to delete content : ${id}`;
      console.error(`${errMsg} : ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
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
