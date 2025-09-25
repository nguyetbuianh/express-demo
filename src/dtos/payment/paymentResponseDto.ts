import { z } from "zod";
import { statusArray } from "../../models/Payment.ts";

export const PaymentResponseDto = z.object({
  id: z.number(),
  amount: z.preprocess((val) => Number(val), z.number()),
  status: z.enum(statusArray),
  createdAt: z.date(),

  user: z
    .object({
      id: z.number(),
      fullName: z.string(),
      email: z.string().email(),
    })
    .optional(),

  course: z
    .object({
      id: z.number(),
      title: z.string(),
    })
    .optional(),
});

export type PaymentResponseDtoType = z.infer<typeof PaymentResponseDto>;
