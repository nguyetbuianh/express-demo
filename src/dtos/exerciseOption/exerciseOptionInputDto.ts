import { z } from "zod";

export const CreateExerciseOptionDto = z.object({
  optionText: z.string().min(1, { message: "Option text is required" }),
  isCorrect: z.boolean().optional(), 
});

export const UpdateExerciseOptionDto = z.object({
  optionText: z.string().min(1, { message: "Option text is required" }).optional(),
  isCorrect: z.boolean().optional(),
});

export type CreateExerciseOptionDtoType = z.infer<typeof CreateExerciseOptionDto>;
export type UpdateExerciseOptionDtoType = z.infer<typeof UpdateExerciseOptionDto>;