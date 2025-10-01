import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function successResponse(
  res: Response,
  data: any,
  statusCode: number = 200,
  message: string = "Success",
  pagination?: PaginationMeta
) {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    pagination, 
  });
}
