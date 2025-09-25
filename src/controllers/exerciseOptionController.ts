import { NextFunction, Request, Response } from "express";
import { exerciseOptionService } from "../services/ExerciseOptionService.ts";
import { BadRequestError } from "../utils/appError.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";

async function addOption(req: Request, res: Response, next: NextFunction) {
  const exerciseId = parseInt(req.params.exerciseId, 10);
  if (isNaN(exerciseId)) {
    throw new BadRequestError("Invalid exercise ID");
  }

  const option = await exerciseOptionService.addOption(exerciseId, req.body);

  return successResponse(res, option, 201, "Option created successfully");
}

async function updateOption(req: Request, res: Response, next: NextFunction) {
  const exerciseOptId = parseInt(req.params.exerciseOptId, 10);
  if (isNaN(exerciseOptId)) {
    throw new BadRequestError("Invalid option ID");
  }

  const updatedOption = await exerciseOptionService.updateOption(
    exerciseOptId,
    req.body
  );

  return successResponse(
    res,
    updatedOption,
    200,
    "Option updated successfully"
  );
}

async function deleteOption(req: Request, res: Response, next: NextFunction) {
  const exerciseOptId = parseInt(req.params.exerciseOptId, 10);
  if (isNaN(exerciseOptId)) {
    throw new BadRequestError("Invalid option ID");
  }

  const deletedOption = await exerciseOptionService.deleteOption(exerciseOptId);

  return successResponse(
    res,
    deletedOption,
    200,
    "Option deleted successfully"
  );
}

export const ExerciseOptionController = {
  addOption: asyncHandler(addOption),
  updateOption: asyncHandler(updateOption),
  deleteOption: asyncHandler(deleteOption),
};
