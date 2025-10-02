import { NextFunction, Request, Response } from "express";
import { vocabularyService } from "../services/vocabulayService.ts";
import { NotFoundError } from "../utils/appError.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";
import { successResponse } from "../utils/response.ts";
import { PaginationParams } from "../utils/pagination.ts";

async function createVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const lessonId = parseInt(req.params.lessonId, 10);
  const vocab = await vocabularyService.createVocabulary(lessonId, req.body);

  return successResponse(res, vocab, 201, "Vocab created successfully");
}

async function getVocabularyByLesson(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const lessonId = parseInt(req.params.lessonId);
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);

  const pagination: PaginationParams = { page, limit };

  const { vocabData, total } = await vocabularyService.getVocabularyByLesson(
    lessonId,
    pagination
  );
  if (!vocabData || vocabData.length === 0) {
    throw new NotFoundError("No vocabulary found for this lesson");
  }

  return successResponse(
    res,
    vocabData,
    200,
    "Vocabularies fetched successfully",
    {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }
  );
}

async function getVocabularyById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const vocabId = parseInt(req.params.vocabularyId, 10);
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
  const vocabId = parseInt(req.params.vocabularyId, 10);
  const updated = await vocabularyService.updateVocabulary(vocabId, req.body);

  return successResponse(res, updated, 200, "Vocab updated successfully");
}

async function deleteVocabulary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const vocabularyId = parseInt(req.params.vocabularyId, 10);
  await vocabularyService.deleteVocabulary(vocabularyId);

  return successResponse(res, null, 200, "Vocab deleted successfully");
}

export const VocabularyController = {
  createVocabulary: asyncHandler(createVocabulary),
  getVocabularyByLesson: asyncHandler(getVocabularyByLesson),
  getVocabularyById: asyncHandler(getVocabularyById),
  updateVocabulary: asyncHandler(updateVocabulary),
  deleteVocabulary: asyncHandler(deleteVocabulary),
};
