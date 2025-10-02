import { NextFunction, Request, Response } from "express";
import { courseService } from "../services/courseService.ts";
import { NotFoundError, UnauthorizedError } from "../utils/appError.ts";
import { successResponse } from "../utils/response.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";
import { PaginationParams } from "../utils/pagination.ts";

async function createCourse(req: Request, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();
  const course = await courseService.createCourse(req.user.id, req.body);

  return successResponse(res, course, 201, "Course created successfully");
}

async function updateCourse(req: Request, res: Response, next: NextFunction) {
  const courseId = parseInt(req.params.courseId, 10);
  const course = await courseService.updateCourse(courseId, req.body);

  return successResponse(res, course, 200, "Course updated successfully");
}

async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  const courseId = parseInt(req.params.courseId, 10);
  await courseService.deleteCourse(courseId);

  return successResponse(res, null, 200, "Course deleted successfully");
}

async function getCourses(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);

  const pagination: PaginationParams = { page, limit };

  const { courseData, total } = await courseService.getCourses(pagination);

  return successResponse(res, courseData, 200, "Courses fetched successfully", {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getCourseDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const courseId = Number(req.params.courseId);
  const course = await courseService.getCourseDetails(courseId);

  return successResponse(
    res,
    course,
    200,
    "Course details fetched successfully"
  );
}

async function getCoursesForStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const courses = await courseService.getCoursesForStudent(req.user.id);

  return successResponse(
    res,
    courses,
    200,
    "Course of student fetched successfully"
  );
}

async function getCourseDetailsForStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const courseId = parseInt(req.params.courseId, 10);
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

async function getCoursesForTeacher(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const courses = await courseService.getCoursesForTeacher(req.user.id);

  return successResponse(
    res,
    courses,
    200,
    "Course of teacher fetched successfully"
  );
}

async function getCourseDetailsForTeacher(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new UnauthorizedError();

  const courseId = parseInt(req.params.courseId, 10);
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
  getCourseDetails: asyncHandler(getCourseDetails),
  getCoursesForStudent: asyncHandler(getCoursesForStudent),
  getCourseDetailsForStudent: asyncHandler(getCourseDetailsForStudent),
  getCoursesForTeacher: asyncHandler(getCoursesForTeacher),
  getCourseDetailsForTeacher: asyncHandler(getCourseDetailsForTeacher),
};
