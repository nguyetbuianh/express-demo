import { Router } from "express";
import { ExerciseOptionController } from "../controllers/ExerciseOptionController.ts";
import { authorize } from "../middlewares/Authorize.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts";
import {
  ExerciseOptionCreateSchema,
  ExerciseOptionUpdateSchema,
} from "../schemas/ExerciseOptionSchema.ts";
import { verifyIds } from "../middlewares/VerifyIds.ts";

const router = Router();

router.post(
  "/:exerciseId",
  authorize(["teacher", "admin"]),
  validateBody(ExerciseOptionCreateSchema),
  verifyIds({ user: true, params: ["exerciseId"] }),
  ExerciseOptionController.addOption
);
router.put(
  "/:exerciseOptId",
  authorize(["teacher", "admin"]),
  validateBody(ExerciseOptionUpdateSchema),
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
