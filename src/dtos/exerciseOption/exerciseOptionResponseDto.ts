import { z } from "zod";

export const ExerciseOptionResponseDto = z.object({
  id: z.number(),
  optionText: z.string(),
  isCorrect: z.boolean(),
});

export type ExerciseOptionResponseDtoType = z.infer<typeof ExerciseOptionResponseDto>;
