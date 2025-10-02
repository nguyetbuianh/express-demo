import { Router } from "express";
import { PaymentController } from "../controllers/paymentController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import { CreatePaymentDto, UpdatePaymentStatusDto } from "../dtos/payment/paymentInputDto.ts";
import { verifyIds, verifyPagination } from "../middlewares/verifyParams.ts";


const router = Router();

router.get(
  "/",
  authorize(["admin"]),
  verifyPagination,
  PaymentController.getPayments
);
router.post(
  "/",
  authorize(["student"]),
  validateBody(CreatePaymentDto),
  PaymentController.createPayment
);
router.patch(
  "/:paymentId/status",
  authorize(["admin", "teacher"]),
  validateBody(UpdatePaymentStatusDto),
  verifyIds(["paymentId"]),
  PaymentController.updatePaymentStatus
);
router.get(
  "/by-user",
  authorize(["student"]),
  PaymentController.getPaymentByUser
);
router.get(
  "/:courseId/has-access",
  authorize(["student"]),
  verifyIds(["courseId"]),
  PaymentController.hasAccess
);

export default router;
