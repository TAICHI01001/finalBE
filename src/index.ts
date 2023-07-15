import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import express from "express";

import { newRepositoryUser } from "./repository/user";
import { newHandlerUser } from "./handler/user";
import { newRepositoryBlacklist } from "./repository/blacklist";
import { newHandlerMiddleware } from "./auth/jwt";
import { newRepositoryContent } from "./repository/content";
import { newHandlerContent } from "./handler/content";

async function main() {
  const db = new PrismaClient();
  const redis = createClient<any, any, any>();

  try {
    await redis.connect();
    await db.$connect();
  } catch (err) {
    console.error(err);
    return;
  }

  const repoUser = newRepositoryUser(db);
  const repoBlacklist = newRepositoryBlacklist(redis);
  const handlerUser = newHandlerUser(repoUser, repoBlacklist);
  const handlerMiddleware = newHandlerMiddleware(repoBlacklist);
  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);

  const port = process.env.PORT || 8000;
  const server = express();
  const userRouter = express.Router();
  const contentRouter = express.Router();
  const authRouter = express.Router();
  // const cors = require("cors");

  // server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  server.use("/user", userRouter);
  server.use("/content", contentRouter);
  server.use("/auth", authRouter);

  // Check server status
  server.get("/", (_, res) => {
    return res.status(200).json({ status: "ok" }).end();
  });

  // User API
  userRouter.post("/register", handlerUser.register.bind(handlerUser));
  authRouter.post("/login", handlerUser.login.bind(handlerUser));
  authRouter.get(
    "/me",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerUser.getId.bind(handlerUser)
  );
  authRouter.get(
    "/logout",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerUser.logout.bind(handlerUser)
  );

  // Content API
  contentRouter.post(
    "/",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.createContent.bind(handlerContent)
  );
  // (Optional) Add usercontent
  // contentRouter.get(
  //   "/usercsontent",
  //   handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
  //   handlerContent.getContent.bind(handlerContent)
  // );

  contentRouter.get("/", handlerContent.getContent.bind(handlerContent));
  contentRouter.get("/:id", handlerContent.getContentById.bind(handlerContent));
  // contentRouter.post("/update", async (_, res) => {
  //   return res.status(400).json({ error: "missing params id" }).end();
  // });
  contentRouter.patch(
    "/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware)
    // handlerContent.updateContent.bind(handlerContent)
  );
  contentRouter.delete(
    "/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware)
    // handlerContent.deleteContent.bind(handlerContent)
  );

  // server
  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
