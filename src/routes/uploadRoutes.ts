import { Router } from "express";
import { upload } from "../lib/upload.ts";
import { uploadFile } from "../controllers/uploadController.ts";

const router = Router();

router.post("/avatar", upload.single("avatar"), uploadFile);

export default router;
