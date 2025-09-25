import { z } from "zod";
import { userRolesArray } from "../../models/User.ts";

export const UserResponseDto = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string().nullable().optional(),
  role: z.enum(userRolesArray),
  avatarUrl: z.string().nullable().optional(),
  createdAt: z.date()
});

export const UserLoginResponseDto = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});

export type UserResponseDtoType = z.infer<typeof UserResponseDto>;
export type UserLoginResponseDtoType = z.infer<typeof UserLoginResponseDto>;
