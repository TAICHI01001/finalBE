import { newJwt } from "./auth/jwt";

import jwt from "jsonwebtoken";

const payload = {
  id: "string",
  username: "Art",
};

const token = newJwt(payload);

try {
  jwt.verify(token, "content-secret");
} catch (err) {
  console.log(err);
}
