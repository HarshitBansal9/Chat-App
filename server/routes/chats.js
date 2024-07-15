import express from "express";
import pool from "../db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

function getUserId(req) {
  const token = req.headers.jwt_token;
  const user = jwt.verify(token, JWT_SECRET);
  return user.sub;
}

router.get("/getchats", async (req, res) => {
  const id = getUserId(req);
  const userChats = await pool.query(
    "SELECT c.chat_id, c.chat_name, p.user_id, CASE WHEN c.is_group = false THEN (SELECT u.username FROM chat_participants cp JOIN users u ON cp.user_id = u.auth_user_id WHERE cp.chat_id = c.chat_id AND cp.user_id != p.user_id LIMIT 1) ELSE NULL END AS other_user_name, CASE WHEN c.last_message_id IS NOT NULL THEN (SELECT m.message_text FROM messages m WHERE m.message_id = c.last_message_id) ELSE NULL END AS last_message_text FROM chats c INNER JOIN chat_participants p ON c.chat_id = p.chat_id WHERE p.user_id = $1 ORDER BY c.chat_id",
    [id]
  );
  res.json(userChats.rows);
});
export default router;
