import { AppDataSource } from "../config/DataSource.ts";
import { Progress } from "../models/Progress.ts";
import { User } from "../models/User.ts";
import { Lesson } from "../models/Lesson.ts";
import { NotFoundError } from "../utils/appError.ts";

class ProgressService {
  private progressRepo = AppDataSource.getRepository(Progress);

  async createProgress(userId: number, lessonId: number) {
    const progress = this.progressRepo.create({
      user: { id: userId },
      lesson: { id: lessonId },
      completed: false,
      score: undefined,
    });
    await this.progressRepo.save(progress);

    return await this.progressRepo.findOne({
      where: { id: progress.id },
      relations: ["user", "lesson"],
    });
  }

  async getProgressById(progressId: number) {
    const progress = await this.progressRepo.findOne({
      where: { id: progressId },
      relations: ["user", "lesson"],
    });

    return progress;
  }

  async updateProgress(
    progressId: number,
    score?: number,
    completed?: boolean
  ) {
    const progress = await this.progressRepo.findOne({
      where: { id: progressId },
    });
    if (!progress) throw new NotFoundError("Progress not found");

    if (score !== undefined) progress.score = score;
    if (completed !== undefined) progress.completed = completed;

    return await this.progressRepo.save(progress);
  }

  async getProgressByUser(userId: number) {
    return await this.progressRepo.find({
      where: { user: { id: userId } },
      relations: ["lesson", "lesson.course"],
    });
  }

  async getProgressForLesson(userId: number, lessonId: number) {
    return await this.progressRepo.findOne({
      where: { user: { id: userId }, lesson: { id: lessonId } },
      relations: ["lesson", "lesson.course"],
    });
  }

  async deleteProgress(progressId: number) {
    const progress = await this.progressRepo.findOne({
      where: { id: progressId },
    });
    if (!progress) throw new NotFoundError("Progress not found");

    return await this.progressRepo.remove(progress);
  }
}

export const progressService = new ProgressService();