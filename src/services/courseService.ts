import { AppDataSource } from "../config/DataSource.ts";
import { NotFoundError } from "../utils/appError.ts";
import { Course } from "../models/Course.ts";
import { User } from "../models/User.ts";
import {
  CreateCourseDtoType,
  UpdateCourseDtoType,
} from "../dtos/course/courseInputDto.ts";
import {
  CourseDetailResponseDto,
  CourseDetailResponseDtoType,
  CourseResponseDto,
  CourseResponseDtoType,
} from "../dtos/course/courseResponseDto.ts";

class CourseService {
  private courseRepo = AppDataSource.getRepository(Course);
  private userRepo = AppDataSource.getRepository(User);

  async createCourse(
    creatorId: number,
    courseData: CreateCourseDtoType
  ): Promise<CourseResponseDtoType> {
    const user = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!user) throw new NotFoundError("User not found");

    const course = this.courseRepo.create({
      ...courseData,
      teacher: user,
    });
    const savedCourse = await this.courseRepo.save(course);

    return CourseResponseDto.parse(savedCourse);
  }

  async updateCourse(
    courseId: number,
    courseData: UpdateCourseDtoType
  ): Promise<CourseResponseDtoType> {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ["teacher"],
    });
    if (!course) throw new NotFoundError("Course not found");

    delete courseData.teacherId;
    Object.assign(course, courseData);

    const savedCourse = await this.courseRepo.save(course);
    return CourseResponseDto.parse(savedCourse);
  }

  async deleteCourse(courseId: number): Promise<void> {
    const result = await this.courseRepo.delete(courseId);
    if (result.affected === 0) {
      throw new NotFoundError("Course not found");
    }
  }

  async getCourses(): Promise<CourseResponseDtoType[]> {
    const courses = await this.courseRepo.find({
      relations: ["teacher"],
      order: { createdAt: "DESC" },
    });

    return courses.map((course) => CourseResponseDto.parse(course));
  }

  async getCourseDetails(
    courseId: number
  ): Promise<CourseDetailResponseDtoType> {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ["teacher", "lessons", "payments"],
    });

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    return CourseDetailResponseDto.parse(course);
  }

  async getCoursesForStudent(userId: number): Promise<CourseResponseDtoType[]> {
    const courses = await this.courseRepo
      .createQueryBuilder("course")
      .innerJoin(
        "course.payments",
        "payment",
        "payment.userId = :userId AND payment.status = :status",
        {
          userId,
          status: "completed",
        }
      )
      .leftJoinAndSelect("course.teacher", "teacher")
      .orderBy("course.createdAt", "DESC")
      .getMany();

    return courses.map((course) => CourseResponseDto.parse(course));
  }

  async getCourseDetailsForStudent(
    courseId: number,
    userId: number
  ): Promise<CourseDetailResponseDtoType> {
    const course = await this.courseRepo
      .createQueryBuilder("course")
      .innerJoin(
        "course.payments",
        "payment",
        "payment.userId = :userId AND payment.status = :status",
        {
          userId,
          status: "completed",
        }
      )
      .leftJoinAndSelect("course.teacher", "teacher")
      .leftJoinAndSelect("course.lessons", "lessons")
      .leftJoinAndSelect("course.payments", "payments")
      .where("course.id = :courseId", { courseId })
      .getOne();

    return CourseDetailResponseDto.parse(course);
  }

  async getCoursesForTeacher(teacherId: number): Promise<CourseResponseDtoType[]> {
    const teacher = await this.userRepo.findOne({ where: { id: teacherId } });
    if (!teacher) throw new NotFoundError("Teacher not found");

    const courses = await this.courseRepo.find({
      where: { teacher: { id: teacherId } },
      relations: ["teacher"],
      order: { createdAt: "DESC" },
    });

    return courses.map((course) => CourseResponseDto.parse(course));
  }

  async getCourseDetailsForTeacher(courseId: number, teacherId: number): Promise<CourseDetailResponseDtoType>  {
    const course = await this.courseRepo.findOne({
      where: { id: courseId, teacher: { id: teacherId } },
      relations: ["teacher", "lessons", "payments"],
    });

    return CourseDetailResponseDto.parse(course);
  }
}

export const courseService = new CourseService();
