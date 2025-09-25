import { NextFunction, Request, Response } from "express";
import { exerciseService } from "../services/ExerciseService.ts";
import { BadRequestError, NotFoundError } from "../utils/appError.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";

async function createExercise(req: Request, res: Response, next: NextFunction) {
  const lessonId = parseInt(req.params.lessonId, 10);
  if (isNaN(lessonId)) {
    throw new BadRequestError("Invalid lesson id");
  }

  const { question, type, options } = req.body;
  if (!question || !type) {
    throw new BadRequestError("Question and type are required");
  }

  const exercise = await exerciseService.createExercise(
    lessonId,
    { question, type },
    options
  );

  return successResponse(res, exercise, 201, "Exercise created successfully");
}

async function getExercisesByLesson(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const lessonId = parseInt(req.params.lessonId, 10);
  if (isNaN(lessonId)) {
    throw new BadRequestError("Invalid lesson id");
  }

  const exercises = await exerciseService.getExercisesByLesson(lessonId);
  if (!exercises || exercises.length === 0) {
    throw new NotFoundError("No exercises found for this lesson");
  }

  return successResponse(res, exercises, 200, "Exercises fetched successfully");
}

async function getExerciseById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const exerciseId = parseInt(req.params.exerciseId, 10);
  if (isNaN(exerciseId)) {
    throw new BadRequestError("Invalid exercise id");
  }

  const exercise = await exerciseService.getExerciseById(exerciseId);
  if (!exercise) {
    throw new NotFoundError("Exercise not found");
  }

  return successResponse(res, exercise, 200, "Exercises fetched successfully");
}

async function updateExercise(req: Request, res: Response, next: NextFunction) {
  const exerciseId = parseInt(req.params.exerciseId, 10);
  if (isNaN(exerciseId)) {
    throw new BadRequestError("Invalid exercise id");
  }

  const { question, type, options } = req.body;
  const updatedExercise = await exerciseService.updateExercise(
    exerciseId,
    { question, type },
    options
  );

  return successResponse(
    res,
    updatedExercise,
    200,
    "Exercises updated successfully"
  );
}

async function deleteExercise(req: Request, res: Response) {
  const exerciseId = parseInt(req.params.exerciseId, 10);
  if (isNaN(exerciseId)) {
    throw new BadRequestError("Invalid exercise id");
  }

  await exerciseService.deleteExercise(exerciseId);

  return successResponse(res, null, 200, "Exercises deleted successfully");
}

export const ExerciseController = {
  createExercise: asyncHandler(createExercise),
  getExercisesByLesson: asyncHandler(getExercisesByLesson),
  getExerciseById: asyncHandler(getExerciseById),
  updateExercise: asyncHandler(updateExercise),
  deleteExercise: asyncHandler(deleteExercise),
};
