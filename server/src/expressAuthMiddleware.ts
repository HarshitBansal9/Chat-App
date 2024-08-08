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
    console.log("got an error"+AuthorizationHeader+"hello");
    return res
      .status(401)
      .json({ success: false, message: "Invalid authorization header" });
  }

  const token = AuthorizationHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token not found" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log("decoded",decoded);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.log("got an error",token);
    console.error(err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }        

};

export default expressAuthMiddleware;
