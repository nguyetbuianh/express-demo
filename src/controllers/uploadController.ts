import { NextFunction, Request, Response } from "express";
import { saveFile } from "../services/uploadService.ts";
import { BadRequestError } from "../utils/appError.ts";

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const fileUrl = saveFile(req.file);

    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (err: any) {
    next(err);
  }
};
