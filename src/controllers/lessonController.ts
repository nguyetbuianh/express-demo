import { NextFunction, Request, Response } from "express";
import { lessonService } from "../services/lessonService.ts";
import { successResponse } from "../utils/response.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";
import { PaginationParams } from "../utils/pagination.ts";

async function createLesson(req: Request, res: Response, next: NextFunction) {
  const { courseId, ...lessonData } = req.body;
  const lesson = await lessonService.createLesson(courseId, lessonData);

  return successResponse(res, lesson, 201, "Lesson created successfully");
}

async function updateLesson(req: Request, res: Response, next: NextFunction) {
  const lessonId = parseInt(req.params.lessonId, 10);
  const lesson = await lessonService.updateLesson(lessonId, req.body);

  return successResponse(res, lesson, 200, "Lesson updated successfully");
}

async function deleteLesson(req: Request, res: Response, next: NextFunction) {
  const lessonId = parseInt(req.params.lessonId, 10);
  await lessonService.deleteLesson(lessonId);

  return successResponse(res, null, 200, "Lesson deleted successfully");
}

async function getLessons(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);

  const pagination: PaginationParams = { page, limit };

  const { lessonData, total } = await lessonService.getLessons(pagination);

  return successResponse(res, lessonData, 200, "Lesson fetched successfully", {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  });
}

async function getLessonsByCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const courseId = parseInt(req.params.courseId, 10);
  const lessons = await lessonService.getLessonsByCourse(courseId);

  return successResponse(
    res,
    lessons,
    200,
    "Lesson of course fetched successfully"
  );
}

async function getLessonDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const lessonId = parseInt(req.params.lessonId, 10);
  const lesson = await lessonService.getLessonDetails(lessonId);

  return successResponse(
    res,
    lesson,
    200,
    "Lesson details fetched successfully"
  );
}

export const LessonController = {
  createLesson: asyncHandler(createLesson),
  updateLesson: asyncHandler(updateLesson),
  deleteLesson: asyncHandler(deleteLesson),
  getLessons: asyncHandler(getLessons),
  getLessonsByCourse: asyncHandler(getLessonsByCourse),
  getLessonDetails: asyncHandler(getLessonDetails),
};
