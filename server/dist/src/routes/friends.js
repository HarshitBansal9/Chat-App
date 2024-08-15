"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _config_1 = __importDefault(require("@config"));
const expressAuthMiddleware_1 = __importDefault(require("src/expressAuthMiddleware"));
const friendClass_1 = __importDefault(require("src/dao/friendClass"));
dotenv_1.default.config();
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
function getUserId(req) {
    const token = req.headers.jwt_token;
    const user = jsonwebtoken_1.default.verify(token, _config_1.default.JWT_SECRET);
    return user.sub;
}
//calling the middleware for jwt token verification for every incoming request
router.use(function (req, res, next) {
    (0, expressAuthMiddleware_1.default)(req, res, next);
    //const chat = new Chat(req.user.sub)
});
router.post("/removefriend", async (req, res) => {
    try {
        const id = getUserId(req);
        const friend = new friendClass_1.default(req.user.sub);
        if (typeof req.query.sender === "string") {
            await friend.removeFriend(req.query.sender);
        }
        /*await pool.query(
          "DELETE FROM friends where ((user1_id = $1 and user2_id = $2)or(user1_id = $2 and user2_id = $1)) and accepted = true",
          [req.query.sender, id]
        );*/
    }
    catch (error) {
        console.error(error);
    }
});
router.get("/getdetails", async (req, res) => {
    try {
        const id = getUserId(req);
        const friend = new friendClass_1.default(req.user.sub);
        const details = await friend.getUserDetails();
        console.log("User details", details);
        res.json(details);
        /*const [allMembers, receivedRequests, allFriends, sentRequests] =
          await Promise.all([
            pool.query(
              "select * from users u where u.auth_user_id != $1 and u.auth_user_id  NOT IN (SELECT user2_id from friends where user1_id= $1) and u.auth_user_id NOT IN (SELECT user1_id from friends)",
              [id]
            ),
            pool.query(
              "select * from users u inner join friends f on (f.user1_id = u.auth_user_id) where f.user2_id = $1 and f.accepted = false",
              [id]
            ),
            pool.query(
              "SELECT * FROM friends f inner join users u on (((f.user2_id = u.auth_user_id) and (f.user1_id = $1 and f.accepted = true )) or ((f.user1_id = u.auth_user_id) and (f.user2_id = $1 and f.accepted = true)));",
              [id]
            ),
            pool.query(
              "SELECT * FROM friends f inner join users u on (f.user2_id = u.auth_user_id) where f.user1_id = $1 and f.accepted = false",
              [id]
            ),
          ]);
        res.json({
          allMembers: allMembers.rows,
          allRequests: receivedRequests.rows,
          allFriends: allFriends.rows,
          sentRequests: sentRequests.rows,
        });
        */
    }
    catch (error) {
        console.error(error);
    }
});
router.post("/sendrequest", async (req, res) => {
    const friend = new friendClass_1.default(req.user.sub);
    try {
        if (typeof req.query.sender === "string" &&
            typeof req.query.receiver === "string") {
            await friend.sendFriendRequest(req.query.receiver);
        }
    }
    catch (error) {
        console.error(error);
    }
    /*await pool.query(
      "INSERT INTO friends (user1_id,user2_id,accepted) VALUES ($1,$2,$3)",
      [req.query.sender, req.query.receiver, false]
    );*/
});
router.post("/cancelrequest", async (req, res) => {
    const friend = new friendClass_1.default(req.user.sub);
    try {
        if (typeof req.query.sender === "string" &&
            typeof req.query.receiver === "string") {
            await friend.cancelFriendRequest(req.query.receiver);
        }
    }
    catch (error) {
        console.error(error);
    }
    /*await pool.query(
      "DELETE FROM friends where user1_id = $1 and user2_id = $2",
      [req.query.sender, req.query.receiver]
    );*/
});
router.post("/handlerequest", async (req, res) => {
    try {
        const friend = new friendClass_1.default(req.user.sub);
        if (typeof req.query.action === "string" &&
            typeof req.query.receiver === "string") {
            await friend.handleRequestResponse(req.query.receiver, req.query.action);
        }
        /*if (req.query.action === "accept") {
          console.log("ran true");
          await pool.query(
            "UPDATE friends SET accepted = true where user1_id = $1 and user2_id = $2",
            [req.query.sender, req.query.receiver]
          );
        } else {
          console.log("ran false");
          await pool.query(
            "DELETE FROM friends where ((user1_id = $1 and user2_id = $2) or (user1_id = $2 and user2_id = $1)) and accepted = false",
            [req.query.sender, req.query.receiver]
          );
        }
        */
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = router;
