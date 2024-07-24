import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "@config";


const expressAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const AuthorizationHeader = req.header("Authorization");

  if (!AuthorizationHeader || !AuthorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid authorization header" });
  }

  const token = AuthorizationHeader.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token not found" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }        

};

export default expressAuthMiddleware;
