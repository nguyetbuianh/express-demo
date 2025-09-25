import { z } from "zod";
import { typeQuestionArray } from "../../models/Exercise.ts";

export const CreateExerciseDto = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  type: z.enum(typeQuestionArray),
  options: z
    .array(
      z.object({
        optionText: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
});

export const UpdateExerciseDto = CreateExerciseDto.partial();

export type CreateExerciseDtoType = z.infer<typeof CreateExerciseDto>;
export type UpdateExerciseDtoType = z.infer<typeof UpdateExerciseDto>;