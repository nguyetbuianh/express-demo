import { NextFunction, Request, Response } from "express";
import { paymentService } from "../services/PaymentService.ts";
import { AuthRequest } from "../types/AuthRequest.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";
import { BadRequestError, UnauthorizedError } from "../utils/appError.ts";
import { statusArray } from "../models/Payment.ts";

async function getAllPayments(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const payments = await paymentService.getAllPayments();

  return successResponse(res, payments, 200, "Course fetched successfully");
}

async function createPayment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const { courseId, amount } = req.body;
  if (!courseId || !amount) {
    throw new BadRequestError("Missing courseId or amount");
  }

  const payment = await paymentService.createPayment(
    req.user.id,
    courseId,
    amount
  );

  return successResponse(res, payment, 201, "Course created successfully");
}

async function getPaymentByUser(
  req: AuthRequest,
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
  if (isNaN(paymentId)) {
    throw new BadRequestError("Invalid payment ID");
  }

  const { status } = req.body;
  if (!statusArray.includes(status)) {
    throw new BadRequestError("Invalid status");
  }

  const payment = await paymentService.updatePaymentStatus(paymentId, status);

  return successResponse(
    res,
    payment,
    200,
    "Payment status updated successfully"
  );
}

async function hasAccess(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) {
    throw new BadRequestError("Invalid course ID");
  }

  const hasAccess = await paymentService.hasAccess(req.user.id, courseId);

  return successResponse(
    res,
    hasAccess,
    200,
    "Couse had accessed successfully"
  );
}

export const PaymentController = {
  getAllPayments: asyncHandler(getAllPayments),
  createPayment: asyncHandler(createPayment),
  getPaymentByUser: asyncHandler(getPaymentByUser),
  updatePaymentStatus: asyncHandler(updatePaymentStatus),
  hasAccess: asyncHandler(hasAccess),
};
