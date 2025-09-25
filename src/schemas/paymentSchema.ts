import { z } from "zod";
import { statusArray } from "../models/Payment.ts";

export const PaymentCreateSchema = z.object({
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  userId: z.number(),
  courseId: z.number(),
});

export const PaymentUpdateStatusSchema = z.object({
  status: z.enum(statusArray),
});
