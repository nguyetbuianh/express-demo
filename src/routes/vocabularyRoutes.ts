import { Router } from "express";
import { VocabularyController } from "../controllers/vocabularyController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
} from "../dtos/vocabulary/vocabInputDto.ts";
import { verifyIds, verifyPagination } from "../middlewares/verifyParams.ts";

const router = Router();

router.post(
  "/lessons/:lessonId",
  authorize(["teacher"]),
  validateBody(CreateVocabularyDto),
  verifyIds(["lessonId"]),
  VocabularyController.createVocabulary
);
router.get(
  "/lessons/:lessonId",
  authorize(["student", "teacher"]),
  verifyIds(["lessonId"]),
  verifyPagination,
  VocabularyController.getVocabularyByLesson
);
router.get(
  "/:vocabularyId",
  authorize(["student", "teacher"]),
  verifyIds(["vocabularyId"]),
  VocabularyController.getVocabularyById
);
router.put(
  "/:vocabularyId",
  authorize(["teacher"]),
  validateBody(UpdateVocabularyDto),
  verifyIds(["vocabularyId"]),
  VocabularyController.updateVocabulary
);
router.delete(
  "/:vocabularyId",
  authorize(["teacher"]),
  verifyIds(["vocabularyId"]),
  VocabularyController.deleteVocabulary
);

export default router;
