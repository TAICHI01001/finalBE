import { Request, Response } from "express";
import { AuthRequest } from "../auth/jwt";

export interface WithId {
  id: string;
}

export interface WithContent {
  videoUrl: string;
  comment: string;
  rating: number;
}
export interface WithContentId {
  id: string;
}
// export type HandlerFunc = (Request, Response) => Promise<Response>;

export interface IHandlerContent {
  createContent: HandlerFunc<AppRequest<Empty, WithContent>>;
  getContent: HandlerFunc<AuthRequest<Request, any>>;
  getContentById: HandlerFunc<AuthRequest<WithId, any>>;
  // updateContent: HandlerFunc<AuthRequest<Request, any>>;
  // getUserContent(
  //   req: AuthRequest<WithContentId, WithContent>,
  //   res: Response
  // ): Promise<Response>;
  // updateContent(
  //   req: AuthRequest<WithContentId, WithContent>,
  //   res: Response
  // ): Promise<Response>;
  // deleteContent(
  //   req: AuthRequest<WithContentId, WithContent>,
  //   res: Response
  // ): Promise<Response>;
}

//! export type HandlerFunc = (Request, Response) => Promise<Response>;
//! export type HandlerFuncAuth = (AuthRequest, Response) => Promise<Response>;

export interface HandlerContent {}

//!============================================================================

// export interface IRepositoryUser {
//   createUser(user: ICreateUser): Promise<IUser>; //! When you createUser or Register, You should have {username,name,password}
//   getUser(username: string): Promise<IUser>; //! When you getUser or Login, You should have username,password
//   getId(id: string): Promise<IUser | null>;
// }

export interface ICreateUser {
  username: string;
  name: string;
  password: string;
}
//! When you create User,You should have fill {id,username,password}
export interface IUser {
  id: string;
  usernames: string;
  password: string;
}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;

//! Start Register and Login
export interface IHandlerUser {
  register: HandlerFunc<AppRequest<Empty, WithUser>>;
  login: HandlerFunc<AppRequest<Empty, WithUser>>;
  logout(req: AuthRequest<Empty, Empty>, res: Response): Promise<Response>;
  getId(req: AuthRequest<Empty, Empty>, res: Response): Promise<Response>;
}
//! End Register and Login

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface WithUser {
  username: string;
  name: string;
  password: string;
}

export interface Empty {}

//!================================================================================================================

//!detail

export interface IOEmbedResponseDto {
  url: string;
  error: string;
  thumbnail_height: number;
  version: string;
  width: number;
  thumbnail_width: number;
  provider_name: string;
  thumbnail_url: string;
  author_url: string;
  author_name: string;
  title: string;
  type: string;
  height: number;
  provider_url: string;
  html: string;
}

interface IOEmbedDetails {
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
}

// Use [OEmbed](https://oembed.com/)
// to get video metadata (from NoEmbed.com)
export async function getVideoDetails(
  videoUrl: string
): Promise<IOEmbedDetails> {
  return await fetch(`https://noembed.com/embed?url=${videoUrl}`)
    .then(async (res) => {
      const {
        title,
        url,
        thumbnail_url,
        author_name,
        author_url,
        error: err,
      } = await res.json();

      if (!title || !url) {
        return Promise.reject(
          `failed to get title and url for content: ${videoUrl}`
        );
      }

      if (err) return Promise.reject(err);

      return {
        videoTitle: title,
        videoUrl: url,
        thumbnailUrl:
          thumbnail_url ??
          "https://placehold.jp/38/fab005/ffffff/480x360.png?text=No+Preview+Available",
        creatorName: author_name ?? "",
        creatorUrl: author_url ?? "",
      };
    })
    .catch((err) => Promise.reject(err));
}
