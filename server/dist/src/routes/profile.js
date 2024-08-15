"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const _config_1 = __importDefault(require("@config"));
const expressAuthMiddleware_1 = __importDefault(require("src/expressAuthMiddleware"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const profileClass_1 = __importDefault(require("@dao/profileClass"));
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
});
router.get("/getuserdetails", async (req, res) => {
    try {
        console.log("getting user details");
        const profile = new profileClass_1.default(req.user.sub);
        const userDetails = await profile.getUserDetails();
        res.json(userDetails);
    }
    catch (error) {
        console.error(error);
    }
    /*
    const id = getUserId(req);
    const userDetails = await pool.query(
      "select * from users where auth_user_id = $1",
      [id]
    );
    res.json(userDetails.rows);
    */
});
exports.default = router;
