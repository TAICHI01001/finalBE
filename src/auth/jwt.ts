import jwt from "jsonwebtoken";
import { Request, NextFunction, Response } from "express";
import { IRepositoryBlacklist } from "../repository";

const secret = process.env.JWT_SECRET || "content-secret";

export interface Payload {
  id: string;
  username: string;
}
export interface AuthRequest<Params, Body> extends Request<Params, any, Body> {
  token: string;
  payload: Payload;
}

export function newJwt(payload: Payload): string {
  return jwt.sign(payload, secret, {
    algorithm: "HS512",
    expiresIn: "12h",
    issuer: "academy",
    subject: "registration",
    audience: "students",
  });
}

export function newHandlerMiddleware(
  repoBlacklist: IRepositoryBlacklist
): IHandlerMiddleware {
  return new HandlerMiddleware(repoBlacklist);
}

interface IHandlerMiddleware {
  jwtMiddleware(req: AuthRequest<any, any>, res: Response, next: NextFunction);
}

class HandlerMiddleware implements IHandlerMiddleware {
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repoBlacklist: IRepositoryBlacklist) {
    this.repoBlacklist = repoBlacklist;
  }
  async jwtMiddleware(
    req: AuthRequest<any, any>,
    res: Response,
    next: NextFunction
  ) {
    const token = req.header("Authorization")?.replace("Bearer", "");
    try {
      if (!token) {
        return res.status(401).json({ error: `missing JWT token` }).end();
      }
      const isBlacklisted = await this.repoBlacklist.isBlacklisted(token);

      if (isBlacklisted) {
        return res.status(401).json({ error: `token is blacklist` }).end();
      }
      const decoded = jwt.verify(token, secret);
      const id = decoded["id"];
      const username = decoded["username"];

      req.token = token;
      req.payload = {
        id: id,
        username: username,
      };
      return next();
    } catch (err) {
      console.error(`Auth failed for token ${token}: ${err}`);
      return res.status(500).json({ error: `authentication failed` }).end();
    }
  }
}
