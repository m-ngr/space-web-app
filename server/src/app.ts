require("dotenv").config();
import "./types";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import pino from "pino-http";
import cors from "cors";

import authRoutes from "./routes/auth";
import assetsRoutes from "./routes/assets";
import profileRoutes from "./routes/profile";
import { authMiddleware } from "./middleware/auth";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pino());
app.use(cors({ origin: "https://nasa-space.onrender.com", credentials: true }));

app.use(authRoutes);

app.use("/assets", authMiddleware, assetsRoutes);
app.use("/profile", authMiddleware, profileRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  req.log.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() =>
    app.listen(port, () => console.log("Server is listening on port", port))
  )
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
