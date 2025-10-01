import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/appError.ts";

export function verifyIds(paramIds?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (paramIds) {
        for (const paramName of paramIds) {
          const id = parseInt(req.params[paramName], 10);
          if (isNaN(id)) {
            throw new BadRequestError(`Invalid ${paramName}`);
          }
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function verifyPagination(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      throw new BadRequestError("Invalid page");
    }

    if (isNaN(limitNum) || limitNum < 1) {
      throw new BadRequestError("Invalid limit");
    }

    next();
  } catch (err) {
    next(err);
  }
}

