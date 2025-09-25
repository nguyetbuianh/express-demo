import { z } from "zod";
import { typeQuestionArray } from "../models/Exercise.ts";

export const ExerciseCreateSchema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  type: z.enum(typeQuestionArray),
});

export const ExerciseUpdateSchema = ExerciseCreateSchema.partial();
