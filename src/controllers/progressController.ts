import { NextFunction, Request, Response } from "express";
import { progressService } from "../services/ProgressService.ts";
import { AuthRequest } from "../types/AuthRequest.ts";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/appError.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";

async function createProgress(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const lessonId = parseInt(req.body.lessonId, 10);
  if (!lessonId) {
    throw new BadRequestError("Invalid lesson ID");
  }

  const progress = await progressService.createProgress(req.user.id, lessonId);

  return successResponse(res, progress, 201, "Progress created successfully");
}

async function getProgressById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const progressId = parseInt(req.params.progressId, 10);
  if (isNaN(progressId)) {
    throw new BadRequestError("Invalid progress ID");
  }

  const progress = await progressService.getProgressById(progressId);

  if (!progress) {
    throw new NotFoundError("Progress not found");
  }

  return successResponse(res, progress, 200, "Progress fetched successfully");
}

async function updateProgress(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const progressId = parseInt(req.params.progressId, 10);
  if (isNaN(progressId)) {
    throw new BadRequestError("Invalid progress ID");
  }

  const progress = await progressService.getProgressById(progressId);
  if (!progress) throw new NotFoundError("Progress not found");
  if (progress.user.id !== req.user?.id) {
    throw new ForbiddenError("Forbidden");
  }

  const { score, completed } = req.body;
  const updatedProgress = await progressService.updateProgress(
    progressId,
    score,
    completed
  );

  return successResponse(
    res,
    updatedProgress,
    200,
    "Progress updated successfully"
  );
}

async function getProgressByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    throw new BadRequestError("Invalid user ID");
  }

  const progresses = await progressService.getProgressByUser(userId);
  if (!progresses || progresses.length === 0) {
    throw new NotFoundError("No progress found for this user");
  }

  return successResponse(res, progresses, 200, "Progress fetched successfully");
}

async function getProgressOfUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const progresses = await progressService.getProgressByUser(req.user.id);
  if (!progresses || progresses.length === 0) {
    throw new NotFoundError("No progress found for this user");
  }

  return successResponse(
    res,
    progresses,
    200,
    "Progress of user fetched successfully"
  );
}

async function getProgressForLesson(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  const lessonId = parseInt(req.params.lessonId);
  if (isNaN(userId) || isNaN(lessonId)) {
    throw new BadRequestError("Invalid user ID or lesson ID");
  }

  const progress = await progressService.getProgressForLesson(userId, lessonId);
  if (!progress) {
    throw new NotFoundError("Progress not found");
  }

  return successResponse(
    res,
    progress,
    200,
    "Progress for lesson fetched successfully"
  );
}

async function getProgressForLessonOfUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const userId = req.user.id;
  const lessonId = parseInt(req.params.lessonId);
  const progress = await progressService.getProgressForLesson(userId, lessonId);
  if (!progress) {
    throw new NotFoundError("Progress not found");
  }

  return successResponse(
    res,
    progress,
    200,
    "Progress for lesson of user fetched successfully"
  );
}

async function deleteProgress(req: Request, res: Response, next: NextFunction) {
  const progressId = parseInt(req.params.progressId, 10);
  if (isNaN(progressId)) {
    throw new BadRequestError("Invalid progress ID");
  }

  await progressService.deleteProgress(progressId);

  return successResponse(res, null, 200, "Progress deleted successfully");
}

export const ProgressController = {
  createProgress: asyncHandler(createProgress),
  getProgressById: asyncHandler(getProgressById),
  updateProgress: asyncHandler(updateProgress),
  getProgressByUser: asyncHandler(getProgressByUser),
  getProgressOfUser: asyncHandler(getProgressOfUser),
  getProgressForLesson: asyncHandler(getProgressForLesson),
  getProgressForLessonOfUser: asyncHandler(getProgressForLessonOfUser),
  deleteProgress: asyncHandler(deleteProgress),
};
