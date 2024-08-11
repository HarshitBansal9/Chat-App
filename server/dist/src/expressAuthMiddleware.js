"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _config_1 = __importDefault(require("@config"));
const expressAuthMiddleware = (req, res, next) => {
    const AuthorizationHeader = req.header("Authorization");
    if (!AuthorizationHeader || !AuthorizationHeader.startsWith("Bearer ")) {
        console.log("got an error" + AuthorizationHeader + "hello");
        return res
            .status(401)
            .json({ success: false, message: "Invalid authorization header" });
    }
    const token = AuthorizationHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Authorization token not found" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, _config_1.default.JWT_SECRET);
        console.log("decoded", decoded);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log("got an error", token);
        console.error(err);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
exports.default = expressAuthMiddleware;
