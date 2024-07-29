"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const friends_js_1 = __importDefault(require("./routes/friends.js"));
const chats_js_1 = __importDefault(require("./routes/chats.js"));
const profile_js_1 = __importDefault(require("./routes/profile.js"));
const cors_1 = __importDefault(require("cors"));
const _config_1 = __importDefault(require("@config"));
const db_js_1 = __importDefault(require("./db.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = _config_1.default.JWT_SECRET;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/friends", friends_js_1.default);
app.use("/chats", chats_js_1.default);
app.use("/profile", profile_js_1.default);
exports.httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(exports.httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
io.of("/chat").on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = socket.handshake.query.token;
    const user = yield (jsonwebtoken_1.default === null || jsonwebtoken_1.default === void 0 ? void 0 : jsonwebtoken_1.default.verify((_a = token === null || token === void 0 ? void 0 : token.toString()) !== null && _a !== void 0 ? _a : "", JWT_SECRET));
    const chatIds = yield db_js_1.default.query("Select cp.chat_id from users u inner join chat_participants cp on (u.auth_user_id = cp.user_id) where u.auth_user_id = $1", [user.sub]);
    for (const chatId of chatIds.rows) {
        socket.join(chatId.chat_id);
    }
    socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        socket.to(data.chatId).emit("receive_message", data);
    }));
    socket.emit("welcome", "Welcome to the chat app");
}));
exports.httpServer.listen(3001, () => {
    console.log("Server is running on port 3001");
});
