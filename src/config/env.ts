import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_PORT: z.string()
    .min(1, "DB_PORT is required")
    .transform((val) => Number(val)), 
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
  DB_NAME: z.string().min(1, "DB_NAME is required"),

  PORT: z.string()
    .default("3000")
    .transform((val) => Number(val)),

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
  JWT_REFRESH_SECRET: z.string().min(10, "JWT_REFRESH_SECRET must be at least 10 characters"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Environment variable validation error:",
    parsedEnv.error.format()
  );
  process.exit(1);
}

export const env = parsedEnv.data;