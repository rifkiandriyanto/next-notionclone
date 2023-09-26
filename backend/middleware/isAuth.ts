import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token as string | undefined;
  if (token) {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_KEY) as {
        userId: string;
      };
      req.userId = userId;
    } catch (error) {
      // Handle JWT verification error here if needed
    }
  }
  next();
};

export default authenticationMiddleware;
