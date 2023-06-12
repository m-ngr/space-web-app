import { Document } from "mongoose";

export interface JwtObject {
  userID: string;
}

export interface IUser extends Document {
  username: string;
  password: string;
  assets: string[];
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}

export interface INasaAsset {
  id: string;
  liked: boolean;
  url: string;
}
