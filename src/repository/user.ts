import { PrismaClient } from "@prisma/client";

import { IRepositoryUser } from "./index";
import { ICreateUser, IUser } from "../entities";

export function newRepositoryUser(db: PrismaClient): IRepositoryUser {
  return new RepositoryUser(db);
}

class RepositoryUser implements IRepositoryUser {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }
  async createUser(user: ICreateUser): Promise<IUser> {
    return await this.db.user.create({ data: user });
  }

  async getUser(username: string): Promise<IUser | null> {
    return await this.db.user.findUnique({ where: { username } });
  }
  async getId(id: string): Promise<IUser | null> {
    return await this.db.user.findUnique({ where: { id } });
  }
}
