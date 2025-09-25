import { Router } from "express";
import { UserController } from "../controllers/UsersController.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts"; 
import { LoginSchema, RegisterSchema } from "../schemas/UserSchema.ts";
import { upload } from "../lib/Upload.ts";

const router = Router();

router.post("/register", validateBody(RegisterSchema), upload.single("avatar"), UserController.register);
router.post("/login", validateBody(LoginSchema), UserController.login);
router.post("/refresh", UserController.refreshToken);

export default router;
