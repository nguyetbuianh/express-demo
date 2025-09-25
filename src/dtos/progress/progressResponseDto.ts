import { z } from "zod";

export const ProgressResponseDto = z.object({
  id: z.number(),
  score: z.number().nullable().optional(),
  completed: z.boolean(),
  createdAt: z.date(),

  user: z
    .object({
      id: z.number(),
      fullName: z.string(),
      email: z.string().email(),
    })
    .optional(),

  lesson: z
    .object({
      id: z.number(),
      title: z.string(),
    })
    .optional(),
});

export type ProgressResponseDtoType = z.infer<typeof ProgressResponseDto>;
