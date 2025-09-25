import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/appError.ts";
import { AuthRequest } from "../types/AuthRequest.ts";

export function verifyIds(options: { user?: boolean; params?: string[] }) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (options.user) {
        if (!req.user || !req.user.id) {
          throw new UnauthorizedError("User not found");
        }
        req.user.id = Number(req.user.id);
      }

      if (options.params) {
        for (const paramName of options.params) {
          const id = parseInt(req.params[paramName], 10);
          if (isNaN(id)) {
            throw new BadRequestError(`Invalid ${paramName}`);
          }
          req.params[paramName] = id as any;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
