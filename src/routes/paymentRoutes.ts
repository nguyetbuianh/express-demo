import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.ts";
import { authorize } from "../middlewares/Authorize.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts";
import { PaymentCreateSchema, PaymentUpdateStatusSchema } from "../schemas/PaymentSchema.ts";
import { verifyIds } from "../middlewares/VerifyIds.ts";


const router = Router();

router.get(
  "/",
  authorize(["admin"]),
  PaymentController.getAllPayments
);
router.post(
  "/",
  authorize(["student"]),
  validateBody(PaymentCreateSchema),
  verifyIds({ user: true}),
  PaymentController.createPayment
);
router.patch(
  "/:paymentId/status",
  authorize(["admin", "teacher"]),
  validateBody(PaymentUpdateStatusSchema),
  verifyIds({ params: ["courseId"] }),
  PaymentController.updatePaymentStatus
);
router.get(
  "/by-user",
  authorize(["student"]),
  verifyIds({ user: true }),
  PaymentController.getPaymentByUser
);
router.get(
  "/:courseId/has-access",
  authorize(["student"]),
  verifyIds({ user: true, params: ["courseId"] }),
  PaymentController.hasAccess
);

export default router;
