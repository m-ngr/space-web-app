import { Schema, model } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default model("user", userSchema);
