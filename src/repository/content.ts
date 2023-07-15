import { PrismaClient } from "@prisma/client";

import { IRepositoryContent } from ".";
import { ICreateContent, IContent } from "../entities";

export function newRepositoryContent(repo: PrismaClient): IRepositoryContent {
  return new RepositoryContent(repo);
}

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

class RepositoryContent implements IRepositoryContent {
  private repo: PrismaClient;

  constructor(repo: PrismaClient) {
    this.repo = repo;
  }

  async createContent(content: ICreateContent): Promise<IContent> {
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

  async getContentById(id: number): Promise<IContent | null> {
    return await this.repo.content.findUnique({
      include: includePostedBy,
      where: {
        id: id,
      },
    });
  }

  async getContent(): Promise<IContent[]> {
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

  async updateContent(
    where: { id: number; userId: string },
    data: { rating: number | undefined; comment: string | undefined }
  ): Promise<IContent> {
    return await this.repo.content
      .update({ include: includePostedBy, where, data })
      .catch((err) => {
        return Promise.reject(
          `failed to update content ${where} with data ${data}`
        );
      });
  }

  async deleteContent(where: {
    id: number;
    userId: string;
  }): Promise<IContent> {
    return await this.repo.content
      .delete({
        include: includePostedBy,
        where: where,
      })
      .then((content) => Promise.resolve(content))
      .catch((err) =>
        Promise.reject(`failed to delate content ${where.id} : ${err}`)
      );
  }

  async getUserContents(userId: string): Promise<IContent[]> {
    return await this.repo.content.findMany({ where: { userId } });
  }

  async deleteUserContentById(arg: {
    id: number;
    userId: string;
  }): Promise<IContent> {
    const content = await this.repo.content.findFirst({
      where: { id: arg.id, userId: arg.userId },
    });

    if (!content) {
      return Promise.reject(`no such content ${arg.id} not found`);
    }

    return this.repo.content.delete({ where: { id: arg.id } });
  }
}
