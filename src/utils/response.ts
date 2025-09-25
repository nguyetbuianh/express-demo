import { Response } from "express";

export function successResponse(
  res: Response,
  data: any,
  statusCode: number = 200,
  message: string = "Success"
) {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
}
