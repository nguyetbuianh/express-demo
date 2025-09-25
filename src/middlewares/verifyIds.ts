import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/appError.ts";
import { AuthRequest } from "../types/authRequest.ts";

export function verifyIds(paramIds?: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (paramIds) {
        for (const paramName of paramIds) {
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
