import { AppDataSource } from "../config/DataSource.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";
import { env } from "../config/env.ts";
import { saveFile } from "./UploadService.ts";
import { BadRequestError, NotFoundError } from "../utils/appError.ts";

class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async registerUser(
    email: string,
    password: string,
    fullName?: string,
    avatarFile?: Express.Multer.File
  ): Promise<Omit<User, "password">> {

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl: string | undefined;
    if (avatarFile) {
      avatarUrl = saveFile(avatarFile);
    }

    const newUser = this.userRepo.create({
      email,
      password: hashedPassword,
      fullName: fullName,
      avatarUrl: avatarUrl,
    });

    const savedUser = await this.userRepo.save(newUser);

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email },
      select: ["id", "email", "password", "role", "fullName", "refreshToken"],
    });
    if (!user) throw new NotFoundError("User not found");

    const valid = await bcrypt.compare(password, user.password);
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

    return { accessToken, refreshToken };
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