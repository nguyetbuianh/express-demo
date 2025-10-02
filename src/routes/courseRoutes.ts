import { Router } from "express";
import { CourseController } from "../controllers/courseController.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validateBody } from "../middlewares/validateMiddleware.ts";
import { CreateCourseDto, UpdateCourseDto } from "../dtos/course/courseInputDto.ts";
import { verifyPagination, verifyIds } from "../middlewares/verifyParams.ts";

const router = Router();

router.get(
  "/",
  authorize(["admin"]),
  verifyPagination,
  CourseController.getCourses
);
router.get(
  "/details/:courseId",
  authorize(["admin"]),
  CourseController.getCourseDetails
);

router.post(
  "/",
  authorize(["teacher", "admin"]),
  validateBody(CreateCourseDto),
  CourseController.createCourse
);
router.put(
  "/:courseId",
  authorize(["teacher", "admin"]),
  validateBody(UpdateCourseDto),
  verifyIds(["courseId"]),
  CourseController.updateCourse
);
router.delete(
  "/:courseId",
  authorize(["teacher", "admin"]),
  verifyIds(["courseId"]),  
  CourseController.deleteCourse
);

router.get(
  "/student",
  authorize(["student"]),
  CourseController.getCoursesForStudent
);
router.get(
  "/student/:courseId",
  authorize(["student"]),
  verifyIds(["courseId"]),
  CourseController.getCourseDetailsForStudent
);
router.get(
  "/teacher",
  authorize(["teacher"]),
  CourseController.getCoursesForTeacher
);
router.get(
  "/teacher/:courseId",
  authorize(["teacher"]),
  verifyIds(["courseId"]),
  CourseController.getCourseDetailsForTeacher
);

export default router;
