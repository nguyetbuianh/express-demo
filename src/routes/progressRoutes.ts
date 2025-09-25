import { Router } from "express";
import { ProgressController } from "../controllers/ProgressController.ts";
import { authorize } from "../middlewares/Authorize.ts";
import { ProgressCreateSchema, ProgressUpdateSchema } from "../schemas/ProgressSchema.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts";
import { verifyIds } from "../middlewares/VerifyIds.ts";

const router = Router();

router.post(
  "/",
  authorize(["student"]),
  validateBody(ProgressCreateSchema),
  verifyIds({ user: true }),
  ProgressController.createProgress
);
router.get(
  "/my-progress",
  authorize(["student"]),
  verifyIds({ user: true }),
  ProgressController.getProgressOfUser
);
router.get(
  "/lesson/:lessonId/my-progress",
  authorize(["student"]),
  verifyIds({ user: true, params: ["lessonId"] }),
  ProgressController.getProgressForLessonOfUser
);
router.get(
  "/:progressId",
  authorize(["student", "teacher"]),
  verifyIds({ params: ["progressId"] }),
  ProgressController.getProgressById
);
router.put(
  "/:progressId",
  authorize(["student"]),
  validateBody(ProgressUpdateSchema),
  verifyIds({ user: true, params: ["lessonId"] }),
  ProgressController.updateProgress
);
router.get(
  "/user/:userId",
  authorize(["admin", "teacher"]),
  verifyIds({ params: ["userId"] }),
  ProgressController.getProgressByUser
);
router.get(
  "/:userId/lesson/:lessonId",
  authorize(["admin", "teacher"]),
  verifyIds({ params: ["userId", "lessonId"] }),
  ProgressController.getProgressForLesson
);
router.delete(
  "/:progressId",
  authorize(["admin", "teacher"]),
  verifyIds({ params: ["progressId"] }),
  ProgressController.deleteProgress
);

export default router;
