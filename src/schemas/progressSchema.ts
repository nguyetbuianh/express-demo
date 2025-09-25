import { z } from "zod";

export const ProgressCreateSchema = z.object({
  score: z.number().int().min(0, { message: "Score must be at least 0" }).max(10, { message: "Score cannot exceed 10" }).optional(),
  completed: z.boolean().optional(),
  lessonId: z.number().min(1, { message: "lessonId must be an integer greater than 0" }),
});

export const ProgressUpdateSchema = z.object({
  score: z.number().int().min(0, { message: "Score must be at least 0" }).max(10, { message: "Score cannot exceed 10" }).optional(),
  completed: z.boolean().optional(),
});
