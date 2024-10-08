import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import friendsRoute from "./routes/friends";
import chatRoute from "./routes/chats";
import profileRoute from "./routes/profile";
import cors from "cors";
import config from "@config";
import pool from "./db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = config.JWT_SECRET;

const app = express();
app.use(cors());
app.use("/friends", friendsRoute);
app.use("/chats", chatRoute);
app.use("/profile", profileRoute);

export const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
io.of("/chat").on("connection", async (socket) => {
  const token = socket.handshake.query.token;

  const user = await jwt?.verify(token?.toString() ?? "", JWT_SECRET);
  const chatIds = await pool.query(
    "Select cp.chat_id from users u inner join chat_participants cp on (u.auth_user_id = cp.user_id) where u.auth_user_id = $1",
    [user.sub]
  );
  for (const chatId of chatIds.rows) {
    socket.join(chatId.chat_id);
  }
  
  socket.on("send_message", async (data) => {
    socket.to(data.chatId).emit("receive_message", data);
  });
  socket.emit("welcome", "Welcome to the chat app");
});
httpServer.listen(3001, () => {
  console.log("Server is running on port 3001");
});
