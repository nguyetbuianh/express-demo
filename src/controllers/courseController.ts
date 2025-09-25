import { NextFunction, Request, Response } from "express";
import { courseService } from "../services/CourseService.ts";
import { AuthRequest } from "../types/AuthRequest.ts";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/appError.ts";
import { successResponse } from "../utils/Response.ts";
import { asyncHandler } from "../middlewares/AsyncHandler.ts";

async function createCourse(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  const course = await courseService.createCourse(req.user.id, req.body);

  return successResponse(res, course, 201, "Course created successfully");
}

async function updateCourse(req: Request, res: Response, next: NextFunction) {
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) {
    throw new BadRequestError("Invalid course ID");
  }

  const course = await courseService.updateCourse(courseId, req.body);

  return successResponse(res, course, 200, "Course updated successfully");
}

async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) {
    throw new BadRequestError("Invalid course ID");
  }

  const course = await courseService.deleteCourse(courseId);

  return successResponse(res, course, 200, "Course deleted successfully");
}

async function getCourses(req: Request, res: Response, next: NextFunction) {
  const courses = await courseService.getCourses();

  return successResponse(res, courses, 200, "Course fetched successfully");
}

async function getCoursesForStudent(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  const courses = await courseService.getCoursesForStudent(req.user.id);

  return successResponse(
    res,
    courses,
    200,
    "Course of student fetched successfully"
  );
}

async function getCourseDetailsForStudent(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) {
    throw new BadRequestError("Invalid course ID");
  }

  const course = await courseService.getCourseDetailsForStudent(
    courseId,
    req.user.id
  );

  if (!course) {
    throw new NotFoundError("Course not found or not purchased");
  }

  return successResponse(
    res,
    course,
    200,
    "Course details of student fetched successfully"
  );
}

async function getCoursesForTeacher(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  const courses = await courseService.getCoursesForTeacher(req.user.id);

  return successResponse(
    res,
    courses,
    200,
    "Course of teacher fetched successfully"
  );
}

async function getCourseDetailsForTeacher(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  const courseId = parseInt(req.params.courseId, 10);
  if (isNaN(courseId)) {
    throw new BadRequestError("Invalid course ID");
  }

  const course = await courseService.getCourseDetailsForTeacher(
    courseId,
    req.user.id
  );

  if (!course) throw new Error("Course not found or you are not the teacher");

  return successResponse(
    res,
    course,
    200,
    "Course details of teacher fetched successfully"
  );
}

export const CourseController = {
  createCourse: asyncHandler(createCourse),
  updateCourse: asyncHandler(updateCourse),
  deleteCourse: asyncHandler(deleteCourse),
  getCourses: asyncHandler(getCourses),
  getCoursesForStudent: asyncHandler(getCoursesForStudent),
  getCourseDetailsForStudent: asyncHandler(getCourseDetailsForStudent),
  getCoursesForTeacher: asyncHandler(getCoursesForTeacher),
  getCourseDetailsForTeacher: asyncHandler(getCourseDetailsForTeacher),
};
