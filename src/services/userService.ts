import { AppDataSource } from "../config/DataSource.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";
import { env } from "../config/env.ts";
import { saveFile } from "./uploadService.ts";
import { BadRequestError, NotFoundError } from "../utils/appError.ts";
import { LoginDtoType, RegisterDtoType } from "../dtos/user/userInputDto.ts";
import {
  UserLoginResponseDto,
  UserLoginResponseDtoType,
  UserResponseDto,
  UserResponseDtoType,
} from "../dtos/user/userResponseDto.ts";

class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async registerUser(
    userData: RegisterDtoType,
    avatarFile?: Express.Multer.File
  ): Promise<UserResponseDtoType> {
    const existingUser = await this.userRepo.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new BadRequestError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let avatarUrl: string | undefined;
    if (avatarFile) {
      avatarUrl = saveFile(avatarFile);
    }

    const newUser = this.userRepo.create({
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      role: userData.role || "student",
      avatarUrl: avatarUrl,
    });

    const savedUser = await this.userRepo.save(newUser);

    return UserResponseDto.parse(savedUser);
  }

  async loginUser(userData: LoginDtoType): Promise<UserLoginResponseDtoType> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email: userData.email },
      select: ["id", "email", "password", "role", "fullName", "refreshToken"],
    });
    console.log("Login result:", userData.email);
    if (!user) throw new NotFoundError("User not found");

    const valid = await bcrypt.compare(userData.password, user.password);
    if (!valid) throw new BadRequestError("Invalid credentials");

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await userRepo.save(user);

    const responseData = {
      accessToken,
      refreshToken,
    };

    return UserLoginResponseDto.parse(responseData);
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        id: string;
        email: string;
      };

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: { id: Number(payload.id) },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new BadRequestError("Invalid refresh token");
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return newAccessToken;
    } catch (err) {
      throw new BadRequestError("Invalid or expired refresh token");
    }
  }
}

export const userService = new UserService();
