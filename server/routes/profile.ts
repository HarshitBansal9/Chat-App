import express from "express";
import pool from "../db.js";
import dotenv from "dotenv";
import config from "@config";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
function getUserId(req:any) {
  const token = req.headers.jwt_token;
  const user = jwt.verify(token, config.JWT_SECRET);
  return user.sub;
}

router.get("/getuserdetails",async (req,res)=>{
    const id = getUserId(req);
    const userDetails = await pool.query("select * from users where auth_user_id = $1",[id]);
    res.json(userDetails.rows);
})


export default router;