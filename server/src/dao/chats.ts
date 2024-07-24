import { db } from "../database";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "@config";

dotenv.config();

class Chat {
  userId:string;

  
  constructor(userId:string){
    this.userId = userId;
  }
}
