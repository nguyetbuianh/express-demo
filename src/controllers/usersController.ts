import { NextFunction, Request, Response } from "express";
import { userService } from "../services/UserService.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";
import { BadRequestError } from "../utils/appError.ts";

async function register(req: Request, res: Response, next: NextFunction) {
  const { email, password, fullName } = req.body;
  const avatarFile = req.file;
  const user = await userService.registerUser(email, password, fullName, avatarFile);

  return successResponse(res, user, 201, "User registered successfully");
}

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);

  return successResponse(res, result, 200, "User logged in successfully");
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new BadRequestError("Missing refresh token");

  const newAccessToken = await userService.refreshAccessToken(refreshToken);

  return successResponse(
    res,
    newAccessToken,
    200,
    "Token refreshed successfully"
  );
}

export const UserController = {
  register: asyncHandler(register),
  login: asyncHandler(login),
  refreshToken: asyncHandler(refreshToken),
};
