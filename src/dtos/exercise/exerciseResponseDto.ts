import { z } from "zod";
import { typeQuestionArray } from "../../models/Exercise.ts";

export const ExerciseResponseDto = z.object({
  id: z.number(),
  question: z.string(),
  type: z.enum(typeQuestionArray),
  createdAt: z.date(),
  options: z
    .array(
      z.object({
        id: z.number(),
        optionText: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
});

export const ExerciseDetailResponseDto = ExerciseResponseDto.extend({
  options: z
    .array(
      z.object({
        id: z.number(),
        optionText: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  lesson: z.object({
    id: z.number(),
    title: z.string(),
  }).optional(),
});

export type ExerciseResponseDtoType = z.infer<typeof ExerciseResponseDto>;
export type ExerciseDetailResponseDtoType = z.infer<
  typeof ExerciseDetailResponseDto
>;
