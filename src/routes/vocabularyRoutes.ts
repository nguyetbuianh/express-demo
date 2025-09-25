import { Router } from "express";
import { VocabularyController } from "../controllers/VocabularyController.ts";
import { authenticate } from "../middlewares/Authenticate.ts";
import { authorize } from "../middlewares/Authorize.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts";
import { VocabularyCreateSchema } from "../schemas/VocabularySchema.ts";
import { verifyIds } from "../middlewares/VerifyIds.ts";

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
