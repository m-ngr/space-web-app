require("dotenv").config();
import "./types";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import homeRoutes from "./routes/home";
import { authMiddleware } from "./middleware/auth";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRoutes);
app.use(authMiddleware);
// protected routes
app.use(homeRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err });
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
