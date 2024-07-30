"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = __importDefault(require("../db.js"));
const _config_1 = __importDefault(require("@config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expressAuthMiddleware_js_1 = __importDefault(require("src/expressAuthMiddleware.js"));
const router = express_1.default.Router();
function getUserId(req) {
    const token = req.headers.jwt_token;
    const user = jsonwebtoken_1.default.verify(token, _config_1.default.JWT_SECRET);
    return user.sub;
}
//calling the middleware for jwt token verification for every incoming request
router.use(function (req, res, next) {
    (0, expressAuthMiddleware_js_1.default)(req, res, next);
});
// ORMs
// Query Builders
router.get("/getchats", async (req, res) => {
    const id = getUserId(req);
    console.log("ran");
    const userChats = await db_js_1.default.query("SELECT c.chat_id, c.chat_name, p.user_id, CASE WHEN c.is_group = false THEN (SELECT u.username FROM chat_participants cp JOIN users u ON cp.user_id = u.auth_user_id WHERE cp.chat_id = c.chat_id AND cp.user_id != p.user_id LIMIT 1) ELSE NULL END AS other_user_name, CASE WHEN c.is_group = false THEN (SELECT u.image_url FROM chat_participants cp JOIN users u ON cp.user_id = u.auth_user_id WHERE cp.chat_id = c.chat_id AND cp.user_id != p.user_id LIMIT 1) ELSE NULL END AS other_user_image_url, CASE WHEN c.last_message_id IS NOT NULL THEN (SELECT m.message_text FROM messages m WHERE m.message_id = c.last_message_id) ELSE NULL END AS last_message_text FROM chats c INNER JOIN chat_participants p ON c.chat_id = p.chat_id WHERE p.user_id = $1 ORDER BY c.chat_id", [id]);
    res.json(userChats.rows);
});
router.get("/getmessages", async (req, res) => {
    const id = getUserId(req);
    const messages = await db_js_1.default.query("select cp.chat_id,m.message_text,m.sender_id,m.sent_at,m.image_url as message_image,u.username,u.image_url as sender_image from (chat_participants cp inner join messages m on (cp.chat_id = m.chat_id)) inner join users u on (m.sender_id = u.auth_user_id) where cp.user_id = $1 order by m.sent_at", [id]);
    res.json(messages.rows);
});
router.post("/sendmessage", async (req, res) => {
    const id = getUserId(req);
    const { chatId, messageText, time, image } = req.query;
    const newMessage = await db_js_1.default.query("INSERT INTO messages (chat_id,sender_id,message_text,image_url,sent_at) VALUES ($1,$2,$3,$4,$5) RETURNING *", [chatId, id, messageText, image, time]);
    res.json(newMessage.rows[0]);
});
exports.default = router;
