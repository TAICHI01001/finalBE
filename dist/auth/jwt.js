"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerMiddleware = exports.newJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "content-secret";
function newJwt(payload) {
    console.log(secret);
    return jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "academy",
        subject: "registration",
        audience: "students",
    });
}
exports.newJwt = newJwt;
function newHandlerMiddleware(repoBlacklist) {
    return new HandlerMiddleware(repoBlacklist);
}
exports.newHandlerMiddleware = newHandlerMiddleware;
class HandlerMiddleware {
    constructor(repoBlacklist) {
        this.repoBlacklist = repoBlacklist;
    }
    async jwtMiddleware(req, res, next) {
        const token = req.header("Authorization")?.replace("Bearer", "");
        try {
            if (!token) {
                return res.status(401).json({ error: `missing JWT token` }).end();
            }
            const isBlacklisted = await this.repoBlacklist.isBlacklisted(token);
            if (isBlacklisted) {
                return res.status(401).json({ error: `token is blacklist` }).end();
            }
            console.log(`${secret}`);
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const id = decoded["id"];
            const username = decoded["username"];
            req.token = token;
            req.payload = {
                id: id,
                username: username,
            };
            return next();
        }
        catch (err) {
            console.error(`Auth failed for token ${token}: ${err}`);
            return res.status(500).json({ error: `authentication failed` }).end();
        }
    }
}
//# sourceMappingURL=jwt.js.map