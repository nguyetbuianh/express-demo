import { NextFunction, Request, Response } from "express";
import { lessonService } from "../services/LessonService.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";
import { BadRequestError } from "../utils/appError.ts";

async function createLesson(req: Request, res: Response, next: NextFunction) {
  const { creatorId, ...lessonData } = req.body;
  const lesson = await lessonService.createLesson(creatorId, lessonData);

  return successResponse(res, lesson, 201, "Lesson created successfully");
}

async function updateLesson(req: Request, res: Response, next: NextFunction) {
  const lessonId = parseInt(req.params.lessonId, 10);
  if (isNaN(lessonId)) {
    throw new BadRequestError("Invalid lesson ID");
  }

  const lesson = await lessonService.updateLesson(lessonId, req.body);

  return successResponse(res, lesson, 200, "Lesson updated successfully");
}

async function deleteLesson(req: Request, res: Response, next: NextFunction) {
  const lessonId = parseInt(req.params.lessonId, 10);
  if (isNaN(lessonId)) {
    throw new BadRequestError("Invalid lesson ID");
  }

  const lesson = await lessonService.deleteLesson(lessonId);

  return successResponse(res, lesson, 200, "Lesson deleted successfully");
}

async function getLessons(req: Request, res: Response, next: NextFunction) {
  const lessons = await lessonService.getLessons();

  return successResponse(res, lessons, 200, "Lesson fetched successfully");
}

async function getLessonsByCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) {
    throw new BadRequestError("Invalid lesson ID");
  }

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
  if (isNaN(lessonId)) {
    throw new BadRequestError("Invalid lesson ID");
  }

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
