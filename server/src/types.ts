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

export interface INasaAsset {
  href: string;
  media_link: string;
  title: string;
  media_type: string;
  description: string;
  nasa_id: string;
}
