import { AppDataSource } from "../config/dataSource.ts";
import {
  CreateLessonDtoType,
  UpdateLessonDtoType,
} from "../dtos/lesson/lessonInputDto.ts";
import {
  LessonDetailResponseDto,
  LessonDetailResponseDtoType,
  LessonResponseDto,
  LessonResponseDtoType,
} from "../dtos/lesson/lessonResponseDto.ts";
import { Course } from "../models/Course.ts";
import { Lesson } from "../models/Lesson.ts";
import { NotFoundError } from "../utils/appError.ts";
import { PaginationParams } from "../utils/pagination.ts";

class LessonService {
  private courseRepo = AppDataSource.getRepository(Course);
  private lessonRepo = AppDataSource.getRepository(Lesson);

  async createLesson(
    courseId: number,
    lessonData: CreateLessonDtoType
  ): Promise<LessonResponseDtoType> {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundError("Course not found");

    const lesson = this.lessonRepo.create({ ...lessonData, course });
    const savedLesson = await this.lessonRepo.save(lesson);

    return LessonResponseDto.parse(savedLesson);
  }

  async updateLesson(
    lessonId: number,
    lessonData: UpdateLessonDtoType
  ): Promise<LessonResponseDtoType> {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundError("Lesson not found");

    Object.assign(lesson, lessonData);
    const savedLesson = await this.lessonRepo.save(lesson);

    return LessonResponseDto.parse(savedLesson);
  }

  async deleteLesson(lessonId: number): Promise<void> {
    const result = await this.lessonRepo.delete(lessonId);

    if (result.affected === 0) {
      throw new NotFoundError("Lesson not found");
    }
  }

  async getLessons(
    pagination: PaginationParams
  ): Promise<{ lessonData: LessonResponseDtoType[]; total: number }> {
    const [lessons, total] = await this.lessonRepo.findAndCount({
      relations: ["course"],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return {
      lessonData: lessons.map((lessons) => LessonResponseDto.parse(lessons)),
      total,
    };
  }

  async getLessonsByCourse(courseId: number): Promise<LessonResponseDtoType[]> {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found");

    const lessons = await this.lessonRepo.find({
      where: { course: { id: courseId } },
      relations: ["course"],
      order: { createdAt: "ASC" },
    });

    return lessons.map((lessons) => LessonResponseDto.parse(lessons));
  }

  async getLessonDetails(
    lessonId: number
  ): Promise<LessonDetailResponseDtoType> {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
      relations: ["course", "vocabulary", "exercises", "progress"],
    });
    if (!lesson) throw new Error("Lesson not found");

    return LessonDetailResponseDto.parse(lesson);
  }
}

export const lessonService = new LessonService();
