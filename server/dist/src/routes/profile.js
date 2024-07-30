"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const dotenv_1 = __importDefault(require("dotenv"));
const _config_1 = __importDefault(require("@config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
function getUserId(req) {
    const token = req.headers.jwt_token;
    const user = jsonwebtoken_1.default.verify(token, _config_1.default.JWT_SECRET);
    return user.sub;
}
router.get("/getuserdetails", async (req, res) => {
    const id = getUserId(req);
    const userDetails = await db_1.default.query("select * from users where auth_user_id = $1", [id]);
    res.json(userDetails.rows);
});
exports.default = router;
