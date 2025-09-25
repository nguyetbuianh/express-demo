import { Router } from "express";
import { ProgressController } from "../controllers/progressController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { CreateProgressDto, UpdateProgressDto } from "../dtos/progress/progressInputDtp.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import { verifyIds } from "../middlewares/verifyIds.ts";

const router = Router();

router.post(
  "/",
  authorize(["student"]),
  validateBody(CreateProgressDto),
  ProgressController.createProgress
); 
router.get(
  "/my-progress",
  authorize(["student"]),
  ProgressController.getProgressOfUser
);
router.get(
  "/lesson/:lessonId/my-progress",
  authorize(["student"]),
  verifyIds(["lessonId"]),
  ProgressController.getProgressForLessonOfUser
);
router.get(
  "/:progressId",
  authorize(["student", "teacher"]),
  verifyIds(["progressId"]),
  ProgressController.getProgressById
);
router.put(
  "/:progressId",
  authorize(["student"]),
  validateBody(UpdateProgressDto),
  verifyIds(["progressId"]),
  ProgressController.updateProgress
);
router.get(
  "/user/:userId",
  authorize(["admin", "teacher"]),
  verifyIds(["userId"]),
  ProgressController.getProgressByUser
);
router.get(
  "/:userId/lesson/:lessonId",
  authorize(["admin", "teacher"]),
  verifyIds(["userId", "lessonId"]),
  ProgressController.getProgressForLesson
);
router.delete(
  "/:progressId",
  authorize(["admin", "teacher"]),
  verifyIds(["progressId"]),
  ProgressController.deleteProgress
);

export default router;
