import { Router } from "express";
import { ExerciseController } from "../controllers/exerciseController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import {
  CreateExerciseDto,
  UpdateExerciseDto,
} from "../dtos/exercise/exerciseInputDto.ts";
import { verifyIds } from "../middlewares/verifyIds.ts";

const router = Router();

router.post(
  "/:lessonId",
  authorize(["admin", "teacher"]),
  validateBody(CreateExerciseDto),
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
  validateBody(UpdateExerciseDto),
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
