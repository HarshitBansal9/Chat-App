import express from "express";
import pool from "../db";
import dotenv from "dotenv";
import config from "@config";
import expressAuthMiddleware from "src/expressAuthMiddleware";
import jwt from "jsonwebtoken";
import Profile from "@dao/profileClass";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
function getUserId(req: any) {
  const token = req.headers.jwt_token;
  const user = jwt.verify(token, config.JWT_SECRET);
  return user.sub;
}

//calling the middleware for jwt token verification for every incoming request
router.use(function (req, res, next) {
  expressAuthMiddleware(req, res, next);
});

router.get("/getuserdetails", async (req, res) => {
  try {
    console.log("getting user details");
    const id = req.query.id;
    const profile = new Profile(req.user.sub);
    if (typeof id === "string") {
      const userDetails = await profile.getUserDetails(id);
      res.json(userDetails);
    }
  } catch (error) {
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

export default router;
