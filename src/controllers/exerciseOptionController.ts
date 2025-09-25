import { NextFunction, Request, Response } from "express";
import { exerciseOptionService } from "../services/exerciseOptionService.ts";
import { successResponse } from "../utils/response.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";

async function addOption(req: Request, res: Response, next: NextFunction) {
  const exerciseId = parseInt(req.params.exerciseId, 10);
  const createdOption = await exerciseOptionService.addOption(exerciseId, req.body);

  return successResponse(res, createdOption, 201, "Option created successfully");
}

async function updateOption(req: Request, res: Response, next: NextFunction) {
  const exerciseOptId = parseInt(req.params.exerciseOptId, 10);
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
