import { z } from "zod";

export const CreateVocabularyDto = z.object({
  word: z.string().min(1, "Word is required"),
  meaning: z.string().min(1, "Meaning is required"),
  example: z.string().optional(),
  audio_url: z.string().url({ message: "Audio URL must be valid" }).optional(),
  image_url: z.string().url({ message: "Image URL must be valid" }).optional(),
});

export const UpdateVocabularyDto = CreateVocabularyDto.partial();

export type CreateVocabularyDtoType = z.infer<typeof CreateVocabularyDto>;
export type UpdateVocabularyDtoType = z.infer<typeof UpdateVocabularyDto>;