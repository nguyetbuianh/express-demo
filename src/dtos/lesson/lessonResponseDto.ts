import { z } from "zod";

export const LessonResponseDto = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.date(),

  course: z
    .object({
      id: z.number(),
      title: z.string(),
    })
    .optional(),
});

export const LessonDetailResponseDto = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.date(),

  course: z
    .object({
      id: z.number(),
      title: z.string(),
    })
    .optional(),

  vocabulary: z
    .array(
      z.object({
        id: z.number(),
        word: z.string(),
        meaning: z.string(),
      })
    )
    .optional(),

  exercises: z
    .array(
      z.object({
        id: z.number(),
        question: z.string(),
      })
    )
    .optional(),

  progress: z
    .array(
      z.object({
        id: z.number(),
        completed: z.boolean(),
      })
    )
    .optional(),
});

export type LessonResponseDtoType = z.infer<typeof LessonResponseDto>;
export type LessonDetailResponseDtoType = z.infer<typeof LessonDetailResponseDto>;
