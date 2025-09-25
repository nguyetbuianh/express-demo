import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.ts";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
}