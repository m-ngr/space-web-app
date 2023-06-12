export interface JwtObject {
  userID: string;
}

export interface IUser {
  username: string;
  password: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
