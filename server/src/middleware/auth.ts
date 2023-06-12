import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "../utils/jwt";
import User from "../models/User";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwtVerify(token);
    const user = await User.findById(payload.userID);
    if (!user) throw "User not found";
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.sendStatus(401);
  }
}

export function isAuth(req: Request) {
  if (req.user) return true;
  return false;
}
