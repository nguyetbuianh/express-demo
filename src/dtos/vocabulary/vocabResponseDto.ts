import { z } from "zod";

export const VocabResponseDto = z.object({
  id: z.number(),
  word: z.string(),
  meaning: z.string(),
  example: z.string().nullable().optional(),
  audio_url: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  lessonId: z.number(), 
});

export type VocabResponseDtoType = z.infer<typeof VocabResponseDto>;
