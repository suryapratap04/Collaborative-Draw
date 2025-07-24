import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "123123";

interface CustomRequest extends Request {
  userId?: string;
}

export function middleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : req.query.token
      ? req.query.token
      : null;

  if (!token) {
    res.status(403).json({
      message: "No Token Found",
    });
    return;
  }

  const decoded = jwt.verify(token as string, JWT_SECRET) as jwt.JwtPayload;

  if (decoded) {
    req.userId = (decoded as jwt.JwtPayload).userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
