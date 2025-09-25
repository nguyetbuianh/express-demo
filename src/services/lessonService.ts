import { AppDataSource } from "../config/DataSource.ts";
import { Course } from "../models/Course.ts";
import { Lesson } from "../models/Lesson.ts";
import { NotFoundError } from "../utils/appError.ts";

class LessonService {
  private courseRepo = AppDataSource.getRepository(Course);
  private lessonRepo = AppDataSource.getRepository(Lesson);

  async createLesson(courseId: number, lessonData: Partial<Lesson>) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundError("Course not found");

    const lesson = this.lessonRepo.create({ ...lessonData, course });

    return await this.lessonRepo.save(lesson);
  }

  async updateLesson(lessonId: number, lessonData: Partial<Lesson>) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundError("Lesson not found");

    Object.assign(lesson, lessonData);

    return await this.lessonRepo.save(lesson);
  }

  async deleteLesson(lessonId: number) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundError("Lesson not found");

    return await this.lessonRepo.remove(lesson);
  }

  async getLessons() {
    return await this.lessonRepo.find({
      order: { createdAt: "DESC" },
    });
  }

  async getLessonsByCourse(courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found");

    return await this.lessonRepo.find({
      where: { course: { id: courseId } },
      order: { createdAt: "ASC" },
    });
  }

  async getLessonDetails(lessonId: number) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
      relations: ["course", "course.teacher"],
    });
    if (!lesson) throw new Error("Lesson not found");

    return lesson;
  }
}

export const lessonService = new LessonService();