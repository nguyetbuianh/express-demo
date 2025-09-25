import { z } from "zod";
import { userRolesArray } from "../../models/User.ts";

export const RegisterDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
  role: z.enum(userRolesArray).optional()
});

export const LoginDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
export type LoginDtoType = z.infer<typeof LoginDto>;
