import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest.ts";

export function authorize(roles: string[] = []) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
