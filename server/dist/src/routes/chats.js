"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const _config_1 = __importDefault(require("@config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chatsClass_1 = __importDefault(require("src/dao/chatsClass"));
const expressAuthMiddleware_1 = __importDefault(require("../expressAuthMiddleware"));
const router = express_1.default.Router();
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
// ORMs
// Query Builders
router.get("/getchats", async (req, res) => {
    const chat = new chatsClass_1.default(req.user.sub);
    const id = getUserId(req);
    console.log("ran");
    const userChats = await db_1.default.query("SELECT c.chat_id, c.chat_name, p.user_id, CASE WHEN c.is_group = false THEN (SELECT u.username FROM chat_participants cp JOIN users u ON cp.user_id = u.auth_user_id WHERE cp.chat_id = c.chat_id AND cp.user_id != p.user_id LIMIT 1) ELSE NULL END AS other_user_name, CASE WHEN c.is_group = false THEN (SELECT u.image_url FROM chat_participants cp JOIN users u ON cp.user_id = u.auth_user_id WHERE cp.chat_id = c.chat_id AND cp.user_id != p.user_id LIMIT 1) ELSE NULL END AS other_user_image_url, CASE WHEN c.last_message_id IS NOT NULL THEN (SELECT m.message_text FROM messages m WHERE m.message_id = c.last_message_id) ELSE NULL END AS last_message_text FROM chats c INNER JOIN chat_participants p ON c.chat_id = p.chat_id WHERE p.user_id = $1 ORDER BY c.chat_id", [id]);
    console.log(userChats.rows);
    res.json(userChats.rows);
});
router.get("/getmessages", async (req, res) => {
    const chat = new chatsClass_1.default(req.user.sub);
    try {
        const messages = await chat.getChatMessages();
        res.json(messages);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
router.post("/createchat", async (req, res) => {
    try {
        const id = getUserId(req);
        const chat = new chatsClass_1.default(req.user.sub);
        if (typeof req.query.user === "string" &&
            typeof req.query.isGroup === "boolean" &&
            typeof req.query.chatName === "string") {
            await chat.createNewChat({
                user: req.query.user,
                isGroup: req.query.isGroup,
                chatName: req.query.chatName,
            });
        }
        /*await pool.query(
          "INSERT INTO chats (chat_id,created_by,is_group,chat_name) VALUES ($1,$2,$3,$4)",
          [uuid, id, req.query.isGroup, req.query.chatName]
        ),
          await pool.query(
            "insert into chat_participants (chat_id, user_id) values ($1,$2),($1,$3)",
            [uuid, id, req.query.user]
          );*/
    }
    catch (error) {
        console.error(error);
    }
});
router.post("/sendmessage", async (req, res) => {
    const chat = new chatsClass_1.default(req.user.sub);
    try {
        const { chatId, messageText, time, image } = req.query;
        let Message;
        if (typeof chatId === "string" &&
            typeof messageText === "string" &&
            typeof time === "string" &&
            typeof image === "string") {
            Message = { chatId, messageText, timestamp: time, imageUrl: image };
        }
        else {
            Message = { chatId, messageText, time, imageUrl: null };
        }
        const messageId = await chat.sendChatMessage(Message);
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;
