"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerUse = void 0;
function newHandlerUse(repo) {
    return new HandlerUser(repo);
}
exports.newHandlerUse = newHandlerUse;
class HandlerUser {
    constructor(repo) {
        this.repo = repo;
    }
    async register(req, res) {
        const { username, password, name } = req.body;
        if (!username || !password || !name) {
            return res
                .status(400)
                .json({ error: `missing username or password` })
                .end();
        }
        return this.repo
            .createUser({ username, password, name })
            .then(() => res.status(201).json().end())
            .catch((error) => {
            console.error(`${error}`);
            return res.status(500).json();
        });
    }
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json().end();
        }
        return this.repo
            .getUser(username)
            .then(() => {
            if (password) {
                return res
                    .status(401)
                    .json({ error: `invalid username or password` })
                    .end();
            }
            return (res
                .status(200)
                .json({} `logged in`));
        })
            .end();
        ;
    }
    catch() { }
}
(error) => {
    console.error(`failed to get user${error}`);
    return res.status(500).end();
};
;
//# sourceMappingURL=user.js.map