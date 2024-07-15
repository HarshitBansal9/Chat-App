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

router.post("/updateSocketId",async (req,res)=>{
    try{
        const id = getUserId(req);
        const socketId = req.query.socketId;
        await pool.query("UPDATE users SET socket_id = $1 WHERE auth_user_id = $2",[socketId,id]);
        res.json({message:"Socket Id updated"});
    }catch(error){
        console.error(error.message);
    }
})

export default router;