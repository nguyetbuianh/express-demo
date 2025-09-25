import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest.ts";
import { ForbiddenError, UnauthorizedError } from "../utils/appError.ts";

export function authorize(roles: string[] = []) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (roles.length && !roles.includes(user.role)) {
      throw new ForbiddenError("Forbidden");
    }

    next();
  };
}
