"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("../auth/bcrypt");
describe("compareHash", () => {
    test("", () => {
        ["1234", "foobar", "taichi"].forEach((passwd) => {
            const hash = (0, bcrypt_1.hashPassword)(passwd);
            expect((0, bcrypt_1.compareHash)(passwd, hash)).toEqual(true);
        });
    });
});
//# sourceMappingURL=bcrypt.test.js.map