import { NextFunction, Request, Response } from "express";
import { exerciseService } from "../services/exerciseService.ts";
import { successResponse } from "../utils/response.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";
import { NotFoundError } from "../utils/appError.ts";

async function createExercise(req: Request, res: Response, next: NextFunction) {
  const lessonId = parseInt(req.params.lessonId, 10);
  const { question, type, options } = req.body;
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
  const exercise = await exerciseService.getExerciseById(exerciseId);
  if (!exercise) {
    throw new NotFoundError("Exercise not found");
  }

  return successResponse(res, exercise, 200, "Exercises fetched successfully");
}

async function updateExercise(req: Request, res: Response, next: NextFunction) {
  const exerciseId = parseInt(req.params.exerciseId, 10);
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
