import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

export function readUserInfo(req: Request, res: Response) {
  const user = req.user!;
  res.json({ username: user.username });
}

export const updateUser = [
  body("username")
    .optional({ values: "null" })
    .trim()
    .matches(/^[a-zA-Z0-9._-]{3,20}$/)
    .withMessage(
      "Username must be between 3 and 20 characters and can only contain alphanumeric characters, dots, dashes, and underscores"
    ),
  body("password")
    .optional({ values: "null" })
    .trim()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,50}$/)
    .withMessage(
      "Password must be between 8 and 50 characters, contain one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let changed = false;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, oldPassword } = req.body;

      if (username && username !== req.user!.username) {
        const existing = await User.findOne({ username });
        if (existing) {
          return res.status(400).json({
            errors: [{ msg: "Username already exists", path: "username" }],
          });
        }
        req.user!.username = username;
        changed = true;
      }

      if (oldPassword && password && password !== oldPassword) {
        if (await bcrypt.compare(oldPassword, req.user!.password)) {
          const hash = await bcrypt.hash(password, 10);
          req.user!.password = hash;
          changed = true;
        } else {
          return res.status(400).json({ error: "Incorrect old password" });
        }
      }

      if (changed) {
        await req.user!.save();
        return res.json({ message: "User updated successfully" });
      }

      return res.status(201).json({ message: "No action" }); // should be error?
    } catch (error) {
      next(error);
    }
  },
];

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.user?.id;
    const deletedUser = await User.findByIdAndDelete(id);
    res.clearCookie("token");

    if (!deletedUser) {
      // TODO search for suitable status code
      return res.status(400).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}
