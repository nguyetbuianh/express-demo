import { Router } from "express";
import { ExerciseController } from "../controllers/ExerciseController.ts";
import { authorize } from "../middlewares/Authorize.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts";
import {
  ExerciseCreateSchema,
  ExerciseUpdateSchema,
} from "../schemas/ExerciseSchema.ts";
import { verifyIds } from "../middlewares/VerifyIds.ts";

const router = Router();

router.post(
  "/:lessonId",
  authorize(["admin", "teacher"]),
  validateBody(ExerciseCreateSchema),
  verifyIds({ params: ["lessonId"] }),
  ExerciseController.createExercise
);
router.get(
  "/lesson/:lessonId",
  authorize(["admin", "teacher", "student"]),
  verifyIds({ params: ["lessonId"] }),
  ExerciseController.getExercisesByLesson
);
router.get(
  "/:exerciseId",
  authorize(["admin", "teacher", "student"]),
  verifyIds({ params: ["exerciseId"] }),
  ExerciseController.getExerciseById
);
router.put(
  "/:exerciseId",
  authorize(["admin", "teacher"]),
  validateBody(ExerciseUpdateSchema),
  verifyIds({ params: ["exerciseId"] }),
  ExerciseController.updateExercise
);
router.delete(
  "/:exerciseId",
  authorize(["admin", "teacher"]),
  verifyIds({ params: ["exerciseId"] }),
  ExerciseController.deleteExercise
);
export default router;
