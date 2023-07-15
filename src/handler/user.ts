import { AppRequest, Empty, WithUser } from ".";
import { compareHash, hashPassword } from "../auth/bcrypt";
import { Response } from "express";
import { IRepositoryUser, IHandlerUser } from ".";
import { AuthRequest, Payload } from "../auth/jwt";
import { newJwt } from "../auth/jwt";
import { IRepositoryBlacklist } from "../repository";

export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
): IHandlerUser {
  return new HandlerUser(repo, repoBlacklist);
}

class HandlerUser implements IHandlerUser {
  private repo: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repo = repo;
  }

  async register(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, name, password } = req.body;
    if (!username || !name || !password) {
      return res
        .status(500)
        .json(`You have entered incomplete information.`)
        .end();
    }
    try {
      const user = await this.repo.createUser({
        username,
        name,
        password: hashPassword(password),
      });
      return res
        .status(200)
        .json(`${user.username}, ${user.name}  You are already signed in.`)
        .end();
    } catch (err) {
      const errMsg = `failed to create user ${username}`;
      console.error(`${err} : ${errMsg}`);
      return res.status(500).json(`${errMsg}`).end();
    }
  }

  async login(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(201).json().end();
    }
    try {
      const user = await this.repo.getUser(username);
      if (!user) {
        return res.status(404).json().end();
      }
      if (!compareHash(password, user.password)) {
        return res.status(401).json().end();
      }
      const payload: Payload = {
        id: user.id,
        username: user.username,
      };
      const token = newJwt(payload);

      return res
        .status(200)
        .json({
          status: "login success",
          accessToken: token,
        })
        .end();
    } catch (err) {
      return res.status(500).json().end();
    }
  }

  async logout(
    req: AuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return this.repoBlacklist
      .addToBlackList(req.token)
      .then(() =>
        res.status(200).json({ status: `logged out successfully` }).end()
      )
      .catch((err) => {
        const errMsg = `failed to logout`;
        console.error(`${errMsg}: ${err}`);

        return res.status(500).json({ error: `failed to logout` });
      });
  }
  async getId(
    req: AuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    if (!req.payload.id) {
      return res.status(400).json({ error: "wrong username or password" });
    }

    console.log(req.payload.id);

    return this.repo
      .getId(req.payload.id)
      .then((user) => res.status(200).json(user))
      .catch((err) => {
        const errMsg = `failed to get id`;
        console.error(`${errMsg}: ${err}`);

        return res.status(500).json({ error: `failed to get id` });
      });
  }
}

// import { Request, Response } from "express";
// import { IRepositoryUser } from "../repository";
// import { IHandlerUser, AppRequest, Empty, WithUser } from ".";

// export function newHandlerUse(repo: IRepositoryUser): IHandlerUser {
//   return new HandlerUser(repo);
// }
// class HandlerUser implements IHandlerUser {
//   private repo: IRepositoryUser;

//   constructor(repo: IRepositoryUser) {
//     this.repo = repo;
//   }

//   async register(
//     req: Request,
//     res: Response
//   ): Promise<Response> {
//     const { username, password, name } = req.body;
//     if (!username || !password || !name) {
//       return res
//         .status(400)
//         .json({ error: `missing username or password` })
//         .end();
//     }

//     return this.repo
//       .createUser({ username, password, name })
//       .then(() => res.status(201).json().end())
//       .catch((error) => {
//         console.error(`${error}`);
//         return res.status(500).json();
//       });
//   }

//   async login(
//     req: AppRequest<Empty, WithUser>,
//     res: Response
//   ): Promise<Response> {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json().end();
//     }
//     return this.repo
//       .getUser(username)
//       .then(() => {
//         if (password) {
//           return res
//             .status(401)
//             .json({ error: `invalid username or password` })
//             .end();
//         }
//         return (
//           res
//             .status(200)
//             .json({`logged in`})
//             .end()
//         );
//       })
//       .catch((error) => {
//         console.error(`failed to get user${error}`);
//         return res.status(500).end();
//       });
//   }
// }

// register(req,res){

//   const {username,name,password} = req.body;

//   if(!username||!name||!password){

//     return res.status().json.end()

//   }
//   try{
//     const user = this.repo.createUser(
//       {
//         username,name,password:Hash(password)
//       });
// return res.status().json().end()

//   }catch(err)=>{
//     const errMsg = `${username}`
//     console.log(`${err}`);
//     return res.status().json().end()
//   }
// }

// login(req,res){

//   const {username,password} = req.body;

//   if(!username||!password){
//     return res.status().json().end()
//   }

//   try{
//     const user = this.repo.getUser(username)
//     if(!user){
//       return res.status().json().end()
//     }
//     if(!compareHash(password,user.password)){
//       return res.status().json().end()
//     }
//     return res.status().json().end()
//   }catch(err){
//     console.log(`${err}`);
//     res.status().json().end()
//   }
// }
