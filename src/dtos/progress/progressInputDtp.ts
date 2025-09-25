import { z } from "zod";

export const CreateProgressDto = z.object({
  lessonId: z.number().min(1, { message: "lessonId must be an integer greater than 0" }),
});

export const UpdateProgressDto = z.object({
  score: z.number().int().min(0, { message: "Score must be at least 0" }).max(10, { message: "Score cannot exceed 10" }).optional(),
  completed: z.boolean().optional(),
});

export type CreateProgressDtoType = z.infer<typeof CreateProgressDto>;
export type UpdateProgressDtoType = z.infer<typeof UpdateProgressDto>;