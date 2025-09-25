import { Router } from "express";
import { PaymentController } from "../controllers/paymentController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import { CreatePaymentDto, UpdatePaymentStatusDto } from "../dtos/payment/paymentInputDto.ts";
import { verifyIds } from "../middlewares/verifyIds.ts";


const router = Router();

router.get(
  "/",
  authorize(["admin"]),
  PaymentController.getAllPayments
);
router.post(
  "/",
  authorize(["student"]),
  validateBody(CreatePaymentDto),
  verifyIds({ user: true}),
  PaymentController.createPayment
);
router.patch(
  "/:paymentId/status",
  authorize(["admin", "teacher"]),
  validateBody(UpdatePaymentStatusDto),
  verifyIds({ params: ["paymentId"] }),
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
