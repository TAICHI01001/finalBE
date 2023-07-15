import { IContent, ICreateContent, ICreateUser, IUser } from "../entities";

export interface IRepositoryContent {
  createContent(content: ICreateContent): Promise<IContent>;
  getContent(): Promise<IContent[]>;
  getContentById(contentId: number): Promise<IContent | null>;
  updateContent(
    where: { id: number; userId: string },
    data: { rating: number | undefined; comment: string | undefined }
  ): Promise<IContent>;
  deleteContent(where: { id: number; userId: string }): Promise<IContent>;
  getUserContents(userId: string): Promise<IContent[]>;
  deleteUserContentById(arg: { id: number; userId: string }): Promise<IContent>;
}

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(username: string): Promise<IUser | null>;
  getId(id: string): Promise<IUser | null>;
}
export interface IRepositoryBlacklist {
  addToBlackList(token: string): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
}
