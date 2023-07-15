"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./auth/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const payload = {
    id: "string",
    username: "Art",
};
const token = (0, jwt_1.newJwt)(payload);
try {
    jsonwebtoken_1.default.verify(token, "content-secret");
}
catch (err) {
    console.log(err);
}
//# sourceMappingURL=taichi.js.map