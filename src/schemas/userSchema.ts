import { z } from "zod";
import { userRolesArray } from "../models/User.ts";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
  role: z.enum(userRolesArray).optional(),
  avatarUrl: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
