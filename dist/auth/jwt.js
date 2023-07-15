"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = exports.newJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "content-secret";
function newJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "academy",
        subject: "registration",
        audience: "students",
    });
}
exports.newJwt = newJwt;
function jwtMiddleware(req, res, next) {
    const token = req.header("Authorization").replace("Bearer", "");
    try {
        if (!token) {
            return res.json().end();
        }
    }
    finally {
    }
}
exports.jwtMiddleware = jwtMiddleware;
//# sourceMappingURL=jwt.js.map