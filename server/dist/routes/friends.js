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
const express_1 = __importDefault(require("express"));
const db_js_1 = __importDefault(require("../db.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const _config_1 = __importDefault(require("@config"));
dotenv_1.default.config();
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
function getUserId(req) {
    const token = req.headers.jwt_token;
    const user = jsonwebtoken_1.default.verify(token, _config_1.default.JWT_SECRET);
    return user.sub;
}
router.get("/getmembers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getUserId(req);
        const allFriends = yield db_js_1.default.query("SELECT * FROM users where auth_user_id != $1", [id]);
        res.json(allFriends.rows);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get("/getrequests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getUserId(req);
        const allRequests = yield db_js_1.default.query("SELECT * FROM friends where user2_id = $1 and accepted = false", [id]);
        res.json(allRequests.rows);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/createchat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getUserId(req);
        const uuid = yield (0, uuid_1.v4)();
        yield db_js_1.default.query("INSERT INTO chats (chat_id,created_by,is_group,chat_name) VALUES ($1,$2,$3,$4)", [uuid, id, req.query.isGroup, req.query.chatName]),
            yield db_js_1.default.query("insert into chat_participants (chat_id, user_id) values ($1,$2),($1,$3)", [uuid, id, req.query.user]);
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/removefriend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getUserId(req);
        console.log("ran");
        yield db_js_1.default.query("DELETE FROM friends where ((user1_id = $1 and user2_id = $2)or(user1_id = $2 and user2_id = $1)) and accepted = true", [req.query.sender, id]);
    }
    catch (error) {
        console.error(error);
    }
}));
router.get("/getdetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = getUserId(req);
        const [allMembers, receivedRequests, allFriends, sentRequests] = yield Promise.all([
            db_js_1.default.query("select * from users u where u.auth_user_id != $1 and u.auth_user_id  NOT IN (SELECT user2_id from friends where user1_id= $1) and u.auth_user_id NOT IN (SELECT user1_id from friends)", [id]),
            db_js_1.default.query("select * from users u inner join friends f on (f.user1_id = u.auth_user_id) where f.user2_id = $1 and f.accepted = false", [id]),
            db_js_1.default.query("SELECT * FROM friends f inner join users u on (((f.user2_id = u.auth_user_id) and (f.user1_id = $1 and f.accepted = true )) or ((f.user1_id = u.auth_user_id) and (f.user2_id = $1 and f.accepted = true)));", [id]),
            db_js_1.default.query("SELECT * FROM friends f inner join users u on (f.user2_id = u.auth_user_id) where f.user1_id = $1 and f.accepted = false", [id]),
        ]);
        res.json({
            allMembers: allMembers.rows,
            allRequests: receivedRequests.rows,
            allFriends: allFriends.rows,
            sentRequests: sentRequests.rows,
        });
    }
    catch (error) {
        console.error(error);
    }
}));
router.post("/sendrequest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_js_1.default.query("INSERT INTO friends (user1_id,user2_id,accepted) VALUES ($1,$2,$3)", [req.query.sender, req.query.receiver, false]);
}));
router.post("/cancelrequest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_js_1.default.query("DELETE FROM friends where user1_id = $1 and user2_id = $2", [req.query.sender, req.query.receiver]);
}));
router.post("/handlerequest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.action === "accept") {
            console.log("ran true");
            yield db_js_1.default.query("UPDATE friends SET accepted = true where user1_id = $1 and user2_id = $2", [req.query.sender, req.query.receiver]);
        }
        else {
            console.log("ran false");
            yield db_js_1.default.query("DELETE FROM friends where ((user1_id = $1 and user2_id = $2) or (user1_id = $2 and user2_id = $1)) and accepted = false", [req.query.sender, req.query.receiver]);
        }
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
