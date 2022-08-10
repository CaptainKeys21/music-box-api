import { Request } from 'express';

declare interface UserSession {
  email: string;
  username: string;
  profileId: string;
}

declare interface CustomRequest<T> extends Request {
  body: T;
}
