import { NextFunction, Request, Response } from "express";
import { vocabularyService } from "../services/VocabulayService.ts";
import { BadRequestError, NotFoundError } from "../utils/appError.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";

async function createVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const lessonId = parseInt(req.params.lessonId);
  if (isNaN(lessonId)) {
    throw new BadRequestError("Invalid lesson ID");
  }

  const vocab = await vocabularyService.createVocabulary(lessonId, req.body);

  return successResponse(res, vocab, 201, "Vocab created successfully");
}

async function getVocabularyByLesson(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const lessonId = parseInt(req.params.lessonId);
  if (isNaN(lessonId)) {
    throw new BadRequestError("Invalid lesson ID");
  }

  const vocabularies = await vocabularyService.getVocabularyByLesson(lessonId);
  if (!vocabularies || vocabularies.length === 0) {
    throw new NotFoundError("No vocabulary found for this lesson");
  }

  return successResponse(
    res,
    vocabularies,
    200,
    "Vocabularies fetched successfully"
  );
}

async function getVocabularyById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const vocabId = parseInt(req.params.vocabularyId);
  if (isNaN(vocabId)) {
    throw new BadRequestError("Invalid vocab ID");
  }

  const vocab = await vocabularyService.getVocabularyById(vocabId);
  if (!vocab) {
    throw new NotFoundError("Vocabulary not found");
  }

  return successResponse(res, vocab, 200, "Vocab fetched successfully");
}

async function updateVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const vocabId = parseInt(req.params.vocabularyId);
  if (isNaN(vocabId)) {
    throw new BadRequestError("Invalid vocab ID");
  }

  const updated = await vocabularyService.updateVocabulary(vocabId, req.body);

  return successResponse(res, updated, 200, "Vocab updated successfully");
}

async function deleteVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.vocabularyId, 10);
  if (isNaN(id)) {
    throw new BadRequestError("Invalid vocab ID");
  }

  await vocabularyService.deleteVocabulary(id);

  return successResponse(res, null, 200, "Vocab deleted successfully");
}

export const VocabularyController = {
  createVocabulary: asyncHandler(createVocabulary),
  getVocabularyByLesson: asyncHandler(getVocabularyByLesson),
  getVocabularyById: asyncHandler(getVocabularyById),
  updateVocabulary: asyncHandler(updateVocabulary),
  deleteVocabulary: asyncHandler(deleteVocabulary),
};
