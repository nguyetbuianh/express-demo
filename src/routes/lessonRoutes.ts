import { Router } from "express";
import { LessonController } from "../controllers/lessonController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import { CreateLessonDto, UpdateLessonDto } from "../dtos/lesson/lessonInputDto.ts";
import { verifyIds } from "../middlewares/verifyIds.ts";

const router = Router();

router.get(
  "/",
  authorize(["admin"]),
  LessonController.getLessons
);
router.post(
  "/",
  authorize(["teacher", "admin"]),
  validateBody(CreateLessonDto),
  LessonController.createLesson
);
router.put(
  "/:lessonId",
  authorize(["teacher", "admin"]),
  validateBody(UpdateLessonDto),
  verifyIds(["lessonId"]),
  LessonController.updateLesson
);
router.delete(
  "/:lessonId",
  authorize(["teacher", "admin"]),
  verifyIds(["lessonId"]),
  LessonController.deleteLesson
);
router.get(
  "/course/:courseId",
  authorize(["admin", "teacher", "student"]),
  verifyIds(["courseId"]),
  LessonController.getLessonsByCourse
);
router.get(
  "/:lessonId",
  authorize(["admin", "teacher", "student"]),
  verifyIds(["lessonId"]),
  LessonController.getLessonDetails
);

export default router;
