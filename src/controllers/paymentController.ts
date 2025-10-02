import { NextFunction, Request, Response } from "express";
import { paymentService } from "../services/paymentService.ts";
import { successResponse } from "../utils/response.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";
import { UnauthorizedError } from "../utils/appError.ts";
import { PaginationParams } from "../utils/pagination.ts";

async function getPayments(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);

  const pagination: PaginationParams = { page, limit };

  const { paymentData, total } = await paymentService.getPayments(pagination);

  return successResponse(
    res,
    paymentData,
    200,
    "Payment fetched successfully",
    {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }
  );
}

async function createPayment(req: Request, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  const payment = await paymentService.createPayment(req.user.id, req.body);

  return successResponse(res, payment, 201, "Course created successfully");
}

async function getPaymentByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();
  const payments = await paymentService.getPaymentsByUser(req.user.id);

  return successResponse(res, payments, 200, "Course fetched successfully");
}

async function updatePaymentStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const paymentId = parseInt(req.params.paymentId, 10);
  const payment = await paymentService.updatePaymentStatus(paymentId, req.body);

  return successResponse(
    res,
    payment,
    200,
    "Payment status updated successfully"
  );
}

async function hasAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();
  const courseId = parseInt(req.params.courseId, 10);
  const hasAccess = await paymentService.hasAccess(req.user.id, courseId);

  return successResponse(
    res,
    hasAccess,
    200,
    "Couse had accessed successfully"
  );
}

export const PaymentController = {
  getPayments: asyncHandler(getPayments),
  createPayment: asyncHandler(createPayment),
  getPaymentByUser: asyncHandler(getPaymentByUser),
  updatePaymentStatus: asyncHandler(updatePaymentStatus),
  hasAccess: asyncHandler(hasAccess),
};
