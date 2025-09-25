import { Router } from "express";
import { LessonController } from "../controllers/LessonController.ts";
import { authorize } from "../middlewares/Authorize.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts";
import { LessonCreateSchema, LessonUpdateSchema } from "../schemas/LessonSchema.ts";
import { verifyIds } from "../middlewares/VerifyIds.ts";

const router = Router();

router.get(
  "/",
  authorize(["admin"]),
  LessonController.getLessons
);
router.post(
  "/",
  authorize(["teacher", "admin"]),
  validateBody(LessonCreateSchema),
  LessonController.createLesson
);
router.put(
  "/:lessonId",
  authorize(["teacher", "admin"]),
  validateBody(LessonUpdateSchema),
  verifyIds({ params: ["lessonId"] }),
  LessonController.updateLesson
);
router.delete(
  "/:lessonId",
  authorize(["teacher", "admin"]),
  verifyIds({ params: ["lessonId"] }),
  LessonController.deleteLesson
);
router.get(
  "/course/:courseId",
  authorize(["admin", "teacher", "student"]),
  verifyIds({ params: ["courseId"] }),
  LessonController.getLessonsByCourse
);
router.get(
  "/:lessonId",
  authorize(["admin", "teacher", "student"]),
  verifyIds({ params: ["lessonId"] }),
  LessonController.getLessonDetails
);

export default router;
