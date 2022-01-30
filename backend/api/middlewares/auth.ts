import jwt from "jsonwebtoken";
import { MyUserRequest, JwtPayload } from "../../models/interfaces";
import { Response, NextFunction } from "express";

export const auth = (req: MyUserRequest, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;
    const secret: string = process.env.APP_SECRET as string;
    const { userId } = jwt.verify(token, secret) as JwtPayload;
    req.userId = userId;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Authentication Failed!",
    });
  }
};
