import { z } from "zod";

export const CreateLessonDto = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
  videoUrl: z.string().url({ message: "Video URL must be valid" }).optional(),
  audioUrl: z.string().url({ message: "Audio URL must be valid" }).optional(),
  imageUrl: z.string().url({ message: "Image URL must be valid" }).optional(),
  courseId: z.number(),
});

export const UpdateLessonDto = CreateLessonDto.partial();

export type CreateLessonDtoType = z.infer<typeof CreateLessonDto>;
export type UpdateLessonDtoType = z.infer<typeof UpdateLessonDto>;