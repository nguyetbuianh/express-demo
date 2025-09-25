import path from "path";
import fs from "fs";
import crypto from "crypto";
import { BadRequestError } from "../utils/appError.ts";

export const saveFile = (file: Express.Multer.File): string => {
  if (!file) {
    throw new BadRequestError("No file uploaded");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new BadRequestError("Only image files are allowed");
  }

  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new BadRequestError("File size exceeds 2MB");
  }

  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const ext = path.extname(file.originalname);
  const uniqueName = crypto.randomUUID() + ext;
  const finalPath = path.join(uploadDir, uniqueName);

  fs.renameSync(file.path, finalPath);

  return `/uploads/${uniqueName}`;
};
