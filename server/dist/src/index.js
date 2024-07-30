"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const friends_1 = __importDefault(require("./routes/friends"));
const chats_1 = __importDefault(require("./routes/chats"));
const profile_1 = __importDefault(require("./routes/profile"));
const cors_1 = __importDefault(require("cors"));
const _config_1 = __importDefault(require("@config"));
const db_1 = __importDefault(require("./db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = _config_1.default.JWT_SECRET;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/friends", friends_1.default);
app.use("/chats", chats_1.default);
app.use("/profile", profile_1.default);
exports.httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(exports.httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
io.of("/chat").on("connection", async (socket) => {
    const token = socket.handshake.query.token;
    const user = await jsonwebtoken_1.default?.verify(token?.toString() ?? "", JWT_SECRET);
    const chatIds = await db_1.default.query("Select cp.chat_id from users u inner join chat_participants cp on (u.auth_user_id = cp.user_id) where u.auth_user_id = $1", [user.sub]);
    for (const chatId of chatIds.rows) {
        socket.join(chatId.chat_id);
    }
    socket.on("send_message", async (data) => {
        socket.to(data.chatId).emit("receive_message", data);
    });
    socket.emit("welcome", "Welcome to the chat app");
});
exports.httpServer.listen(3001, () => {
    console.log("Server is running on port 3001");
});
