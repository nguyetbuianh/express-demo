import { z } from "zod";
import { statusArray } from "../../models/Payment.ts";

export const CreatePaymentDto = z.object({
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  courseId: z.number(),
});

export const UpdatePaymentStatusDto = z.object({
  status: z.enum(statusArray),
});

export type CreatePaymentDtoType = z.infer<typeof CreatePaymentDto>;
export type UpdatePaymentStatusDtoType = z.infer<typeof UpdatePaymentStatusDto>;