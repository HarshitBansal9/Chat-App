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

router.post("/removefriend", async (req, res) => {
  try {
    const id = getUserId(req);
    console.log('ran');
    await pool.query(
      "DELETE FROM friends where ((user1_id = $1 and user2_id = $2)or(user1_id = $2 and user2_id = $1)) and accepted = true",
      [req.query.sender, id]
    );
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/getdetails", async (req, res) => {
  try {
    const id = getUserId(req);
    const [allMembers, receivedRequests, allFriends, sentRequests] =
      await Promise.all([
        pool.query(
          "select * from users u where u.auth_user_id != $1 and u.auth_user_id  NOT IN (SELECT user2_id from friends where user1_id= $1) and u.auth_user_id NOT IN (SELECT user1_id from friends)",
          [id]
        ),
        pool.query(
          "select * from users u inner join friends f on (f.user1_id = u.auth_user_id) where f.user2_id = $1 and f.accepted = false",
          [id]
        ),
        pool.query(
          "SELECT * FROM friends f inner join users u on (((f.user2_id = u.auth_user_id) and (f.user1_id = $1 and f.accepted = true )) or ((f.user1_id = u.auth_user_id) and (f.user2_id = $1 and f.accepted = true)));",
          [id]
        ),
        pool.query(
          "SELECT * FROM friends f inner join users u on (f.user2_id = u.auth_user_id) where f.user1_id = $1 and f.accepted = false",
          [id]
        ),
      ]);
    res.json({
      allMembers: allMembers.rows,
      allRequests: receivedRequests.rows,
      allFriends: allFriends.rows,
      sentRequests: sentRequests.rows,
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

router.post("/cancelrequest", async (req, res) => {
  await pool.query(
    "DELETE FROM friends where user1_id = $1 and user2_id = $2",
    [req.query.sender, req.query.receiver]
  );
});

router.post("/handlerequest", async (req, res) => {
  try {
    if (req.query.action === "accept") {
      console.log("ran true");
      await pool.query(
        "UPDATE friends SET accepted = true where user1_id = $1 and user2_id = $2",
        [req.query.sender, req.query.receiver]
      );
    } else {
      console.log("ran false")
      await pool.query(
        "DELETE FROM friends where ((user1_id = $1 and user2_id = $2) or (user1_id = $2 and user2_id = $1)) and accepted = false",
        [req.query.sender, req.query.receiver]
      );
    }
  } catch (error) {
    console.error(error.message);
  }
});

export default router;
