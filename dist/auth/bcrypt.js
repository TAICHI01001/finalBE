"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
function hashPassword(password) {
    const salt = bcrypt_1.default.genSaltSync(10);
    return bcrypt_1.default.hashSync(password, salt);
}
exports.hashPassword = hashPassword;
function compareHash(password, hash) {
    return bcrypt_1.default.compareSync(password, hash);
}
exports.compareHash = compareHash;
//# sourceMappingURL=bcrypt.js.map