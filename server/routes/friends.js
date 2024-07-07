import express from "express";
import pool from "../db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pkg from "@supabase/supabase-js";
const { createClient } = pkg;

dotenv.config();
const router = express.Router();
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function getUserId(req) {
  const token = req.headers.jwt_token;
  const user = jwt.verify(token, JWT_SECRET);
  return user.sub;
}
router.get("/getmembers", async (req, res) => {
  try {
    const id = getUserId(req);
    const allFriends = await pool.query(
      "SELECT * FROM users where auth_user_id != $1",
      [id]
    );
    res.json(allFriends.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/getrequests", async (req, res) => {
  try {
    const id = getUserId(req);
    const allRequests = await pool.query(
      "SELECT * FROM friends where user2_id = $1 and accepted = false",
      [id]
    );
    res.json(allRequests.rows);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/getdetails", async (req, res) => {
  try {
    const id = getUserId(req);
    const [allMembers, allRequests, allFriends] = await Promise.all([
      pool.query(
        "select * from users u where u.auth_user_id != $1 and u.auth_user_id IN (SELECT user2_id from friends where user1_id= $1)",
        [id]
      ),
      pool.query(
        "select * from users u inner join friends f on (f.user1_id = u.auth_user_id) where f.user2_id = $1",
        [id]
      ),
      pool.query(
        "SELECT * FROM friends where user1_id = $1 and accepted = true or user2_id = $1 and accepted = true",
        [id]
      ),
    ]);
    res.json({
      allMembers: allMembers.rows,
      allRequests: allRequests.rows,
      allFriends: allFriends.rows,
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/sendrequest", async (req, res) => {
  await pool.query(
    "INSERT INTO friends (user1_id,user2_id,accepted) VALUES ($1,$2,$3)",
    [req.query.sender, req.query.receiver, false]
  );
});
export default router;
