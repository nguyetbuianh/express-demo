import { z } from "zod";
import { levelArray } from "../../models/Course.ts";
import { statusArray } from "../../models/Payment.ts";

export const CourseResponseDto = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  level: z.enum(levelArray),
  price: z.preprocess((val) => Number(val), z.number()),
  teacher: z.object({
    id: z.number().nullable(),
    fullName: z.string().nullable(),
  }),
  createdAt: z.date(),
});

export const CourseDetailResponseDto = CourseResponseDto.extend({
  lessons: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      createdAt: z.date(),
    })
  ),
  payments: z.array(
    z.object({
      id: z.number(),
      amount: z.preprocess((val) => Number(val), z.number()),
      status: z.enum(statusArray),
      createdAt: z.date(),
    })
  ),
});

export type CourseResponseDtoType = z.infer<typeof CourseResponseDto>;
export type CourseDetailResponseDtoType = z.infer<
  typeof CourseDetailResponseDto
>;
