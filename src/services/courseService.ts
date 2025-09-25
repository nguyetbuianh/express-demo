import { AppDataSource } from "../config/DataSource.ts";
import { NotFoundError } from "../utils/appError.ts";
import { Course } from "../models/Course.ts";
import { User } from "../models/User.ts";

class CourseService {
  private courseRepo = AppDataSource.getRepository(Course);
  private userRepo = AppDataSource.getRepository(User);

  async createCourse(creatorId: number, courseData: Partial<Course>) {
    const user = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!user) throw new NotFoundError("User not found");

    const course = this.courseRepo.create({
      ...courseData,
      teacher: user,
    });

    return await this.courseRepo.save(course);
  }

  async updateCourse(courseId: number, courseData: Partial<Course>) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found");

    Object.assign(course, courseData);

    return await this.courseRepo.save(course);
  }

  async deleteCourse(courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundError("Course not found");

    return await this.courseRepo.remove(course);
  }

  async getCourses() {
    return await this.courseRepo.find({
      relations: ["teacher"],
      order: { createdAt: "DESC" },
    });
  }

  async getCoursesForStudent(userId: number) {
    return await this.courseRepo
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
  }

  async getCourseDetailsForStudent(courseId: number, userId: number) {
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

    return course;
  }

  async getCoursesForTeacher(teacherId: number) {
    const teacher = await this.userRepo.findOne({ where: { id: teacherId } });
    if (!teacher) throw new NotFoundError("Teacher not found");

    const courses = await this.courseRepo.find({
      where: { teacher: { id: teacherId } },
      relations: ["teacher"],
      order: { createdAt: "DESC" },
    });

    return courses;
  }

  async getCourseDetailsForTeacher(courseId: number, teacherId: number) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId, teacher: { id: teacherId } },
      relations: ["teacher", "lessons", "payments"],
    });

    return course;
  }
}

export const courseService = new CourseService();