import { AppDataSource } from "../config/DataSource.ts";
import {
  CreateProgressDtoType,
  UpdateProgressDtoType,
} from "../dtos/progress/progressInputDtp.ts";
import {
  ProgressResponseDto,
  ProgressResponseDtoType,
} from "../dtos/progress/progressResponseDto.ts";
import { Progress } from "../models/Progress.ts";
import { NotFoundError } from "../utils/appError.ts";

class ProgressService {
  private progressRepo = AppDataSource.getRepository(Progress);

  async createProgress(
    userId: number,
    progressData: CreateProgressDtoType
  ): Promise<ProgressResponseDtoType> {
    const progress = this.progressRepo.create({
      user: { id: userId },
      lesson: { id: progressData.lessonId },
      completed: false,
      score: undefined,
    });
    await this.progressRepo.save(progress);

    const savedProgress = await this.progressRepo.findOne({
      where: { id: progress.id },
      relations: ["user", "lesson"],
    });

    return ProgressResponseDto.parse(savedProgress);
  }

  async getProgressById(progressId: number): Promise<ProgressResponseDtoType> {
    const progress = await this.progressRepo.findOne({
      where: { id: progressId },
      relations: ["user", "lesson"],
    });

    return ProgressResponseDto.parse(progress);
  }

  async updateProgress(
    progressId: number,
    progressData: Partial<UpdateProgressDtoType>
  ): Promise<ProgressResponseDtoType> {
    const progress = await this.progressRepo.findOne({
      where: { id: progressId },
    });
    if (!progress) throw new NotFoundError("Progress not found");

    if (progressData.score !== undefined) progress.score = progressData.score;
    if (progressData.completed !== undefined) progress.completed = progressData.completed;
    const updatedProgress = await this.progressRepo.save(progress);

    return ProgressResponseDto.parse(updatedProgress);
  }

  async getProgressByUser(userId: number): Promise<ProgressResponseDtoType[]> {
    const progress =  await this.progressRepo.find({
      where: { user: { id: userId } },
      relations: ["lesson", "lesson.course"],
    });

    return progress.map((progress) => ProgressResponseDto.parse(progress));
  }

  async getProgressForLesson(userId: number, lessonId: number): Promise<ProgressResponseDtoType> {
    const progress =   await this.progressRepo.findOne({
      where: { user: { id: userId }, lesson: { id: lessonId } },
      relations: ["lesson", "lesson.course"],
    });

    return ProgressResponseDto.parse(progress);
  }

  async deleteProgress(progressId: number): Promise<void> {
    const result = await this.progressRepo.delete(progressId);
    if (result.affected === 0) {
      throw new NotFoundError("Progress not found");
    }
  }
}

export const progressService = new ProgressService();
