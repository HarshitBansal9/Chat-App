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
router.get("/getuserdetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = getUserId(req);
    const userDetails = yield db_js_1.default.query("select * from users where auth_user_id = $1", [id]);
    res.json(userDetails.rows);
}));
exports.default = router;
