require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
