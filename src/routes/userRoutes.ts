import { Router } from "express";
import { UserController } from "../controllers/usersController.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts"; 
import { RegisterDto, LoginDto } from "../dtos/user/userInputDto.ts";
import { upload } from "../lib/upload.ts";

const router = Router();

router.post("/register", validateBody(RegisterDto), upload.single("avatar"), UserController.register);
router.post("/login", validateBody(LoginDto), UserController.login);
router.post("/refresh", UserController.refreshToken);

export default router;
