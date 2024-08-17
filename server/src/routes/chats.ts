import express from "express";
import pool from "../db";
import config from "@config";
import jwt from "jsonwebtoken";
import Chat from "src/dao/chatsClass";
import expressAuthMiddleware from "../expressAuthMiddleware";
const router = express.Router();
declare module "express-serve-static-core" {
  export interface Request {
    user: any;
  }
}

interface ChatMessage {
  chatId: string;
  messageText: string;
  timestamp: Date;
  imageUrl: string;
}

function getUserId(req: any) {
  const token = req.headers.jwt_token;
  const user = jwt.verify(token, config.JWT_SECRET);
  return user.sub;
}

//calling the middleware for jwt token verification for every incoming request
router.use(function (req, res, next) {
  expressAuthMiddleware(req, res, next);
  //const chat = new Chat(req.user.sub)
});

// ORMs

// Query Builders

router.get("/getchatsnew",async (req,res)=>{
  const chat = new Chat(req.user.sub);
  const chats = await chat.getChats();
  console.log("new chats",chats);
  res.json(chats);
})

router.get("/getchats", async (req, res) => {
  const chat = new Chat(req.user.sub);
  const id = getUserId(req);
  console.log("ran");
  const userChats = await pool.query(
    "SELECT c.chat_id, c.chat_name, p.user_id, CASE WHEN c.is_group = false THEN (SELECT u.username FROM chat_participants cp JOIN users u ON cp.user_id = u.auth_user_id WHERE cp.chat_id = c.chat_id AND cp.user_id != p.user_id LIMIT 1) ELSE NULL END AS other_user_name, CASE WHEN c.is_group = false THEN (SELECT u.image_url FROM chat_participants cp JOIN users u ON cp.user_id = u.auth_user_id WHERE cp.chat_id = c.chat_id AND cp.user_id != p.user_id LIMIT 1) ELSE NULL END AS other_user_image_url, CASE WHEN c.last_message_id IS NOT NULL THEN (SELECT m.message_text FROM messages m WHERE m.message_id = c.last_message_id) ELSE NULL END AS last_message_text FROM chats c INNER JOIN chat_participants p ON c.chat_id = p.chat_id WHERE p.user_id = $1 ORDER BY c.chat_id",
    [id]
  );
  console.log("old chats",userChats.rows);
  res.json(userChats.rows);
});

router.get("/getmessages", async (req, res) => {
  const chat = new Chat(req.user.sub);
  try {
    const messages = await chat.getChatMessages();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/createchat", async (req, res) => {
  try {
    const id = getUserId(req);
    const chat = new Chat(req.user.sub);
    if (
      typeof req.query.user === "string" &&
      typeof req.query.isGroup === "boolean" &&
      typeof req.query.chatName === "string"
    ) {
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
  } catch (error) {
    console.error(error);
  }
});

router.post("/sendmessage", async (req, res) => {
  const chat = new Chat(req.user.sub);
  try {
    const { chatId, messageText, time, image } = req.query;
    let Message: any;
    if (
      typeof chatId === "string" &&
      typeof messageText === "string" &&
      typeof time === "string" &&
      typeof image === "string"
    ) {
      Message = { chatId, messageText, timestamp: time, imageUrl: image };
    } else {
      Message = { chatId, messageText, time, imageUrl: null };
    }
    const messageId = await chat.sendChatMessage(Message);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
export default router;
