import { Request } from "express";

export interface MyUserRequest extends Request {
  user?: string;
  userId?: number;
}

export interface JwtPayload {
  userId: number;
}
