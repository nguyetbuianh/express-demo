import { z } from "zod";

export const ExerciseOptionCreateSchema = z.object({
  optionText: z.string().min(1, { message: "Option text is required" }),
  isCorrect: z.boolean().optional(), 
});

export const ExerciseOptionUpdateSchema = z.object({
  optionText: z.string().min(1, { message: "Option text is required" }).optional(),
  isCorrect: z.boolean().optional(),
});
