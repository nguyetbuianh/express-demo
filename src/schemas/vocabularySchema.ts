import { z } from "zod";

export const VocabularyCreateSchema = z.object({
  word: z.string().min(1, "Word is required"),
  meaning: z.string().min(1, "Meaning is required"),
  example: z.string().optional(),
  audio_url: z.string().url({ message: "Audio URL must be valid" }).optional(),
  image_url: z.string().url({ message: "Image URL must be valid" }).optional(),
});

export const VocabularyUpdateSchema = VocabularyCreateSchema.partial();

