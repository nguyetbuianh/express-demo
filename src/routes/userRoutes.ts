import { Router } from "express";
import { UserController } from "../controllers/usersController.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts"; 
import { LoginSchema, RegisterSchema } from "../dtos/userSchema.ts";
import { upload } from "../lib/upload.ts";

const router = Router();

router.post("/register", validateBody(RegisterSchema), upload.single("avatar"), UserController.register);
router.post("/login", validateBody(LoginSchema), UserController.login);
router.post("/refresh", UserController.refreshToken);

export default router;
