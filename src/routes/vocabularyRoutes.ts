import { Router } from "express";
import { VocabularyController } from "../controllers/vocabularyController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import { VocabularyCreateSchema } from "../dtos/vocabularySchema.ts";
import { verifyIds } from "../middlewares/verifyIds.ts";

const router = Router();

router.post(
  "/lessons/:lessonId",
  authorize(["teacher"]),
  validateBody(VocabularyCreateSchema),
  VocabularyController.createVocabulary
);
router.get(
  "/lessons/:lessonId",
  authorize(["student", "teacher"]),
  VocabularyController.getVocabularyByLesson
);
router.get(
  "/:vocabularyId",
  authorize(["student", "teacher"]),
  verifyIds({ params: ["vocabularyId"] }),
  VocabularyController.getVocabularyById
);
router.put(
  "/:vocabularyId",
  authorize(["teacher"]),
  validateBody(VocabularyCreateSchema),
  verifyIds({ params: ["vocabularyId"] }),
  VocabularyController.updateVocabulary
);
router.delete(
  "/:vocabularyId",
  authorize(["teacher"]),
  verifyIds({ params: ["vocabularyId"] }),
  VocabularyController.deleteVocabulary
);

export default router;
