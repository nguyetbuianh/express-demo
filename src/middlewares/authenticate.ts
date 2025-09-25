import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../utils/appError.ts";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new UnauthorizedError("No token provided");

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    throw new BadRequestError("Invalid token");
  }
};
