import { Router } from "express";
import { upload } from "../lib/Upload.ts";
import { uploadFile } from "../controllers/UploadController.ts";

const router = Router();

router.post("/avatar", upload.single("avatar"), uploadFile);

export default router;
