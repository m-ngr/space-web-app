import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User";
import { jwtSign } from "../utils/jwt";

export const signup = [
  body("username")
    .trim()
    .matches(/^[a-zA-Z0-9._-]{3,20}$/)
    .withMessage(
      "Username must be between 3 and 20 characters and can only contain alphanumeric characters, dots, dashes, and underscores"
    ),
  body("password")
    .trim()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,50}$/)
    .withMessage(
      "Password must be between 8 and 50 characters, contain one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({
          errors: [{ msg: "Username already exists", path: "username" }],
        });
      }

      const hash = await bcrypt.hash(password, 10);
      await User.create({ username, password: hash });
      return res.json({ message: "User created" });
    } catch (error) {
      next(error);
    }
  },
];

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.cookie("token", jwtSign({ userID: user.id }), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    req.user = user;
    return res.json({ message: "login success" });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.sendStatus(200);
}
