import { z } from "zod";
import { levelArray } from "../../models/Course.ts";

export const CreateCourseDto = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  level: z.enum(levelArray),
  price: z.number().min(0, { message: "Price must be greater than or equal to 0" }).optional(),
  teacherId: z.number(),
});

export const UpdateCourseDto = CreateCourseDto.partial();

export type CreateCourseDtoType = z.infer<typeof CreateCourseDto>;
export type UpdateCourseDtoType = z.infer<typeof UpdateCourseDto>;