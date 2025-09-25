import { Router } from "express";
import { ExerciseOptionController } from "../controllers/exerciseOptionController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import {
  CreateExerciseOptionDto,
  UpdateExerciseOptionDto,
} from "../dtos/exerciseOption/exerciseOptionInputDto.ts";
import { verifyIds } from "../middlewares/verifyIds.ts";

const router = Router();

router.post(
  "/:exerciseId",
  authorize(["teacher", "admin"]),
  validateBody(CreateExerciseOptionDto),
  verifyIds({ user: true, params: ["exerciseId"] }),
  ExerciseOptionController.addOption
);
router.put(
  "/:exerciseOptId",
  authorize(["teacher", "admin"]),
  validateBody(UpdateExerciseOptionDto),
  verifyIds({ user: true, params: ["exerciseOptId"] }),
  ExerciseOptionController.updateOption
);
router.delete(
  "/:exerciseOptId",
  authorize(["teacher", "admin"]),
  verifyIds({ user: true, params: ["exerciseOptId"] }),
  ExerciseOptionController.deleteOption
);

export default router;
