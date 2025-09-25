import { Router } from "express";
import { CourseController } from "../controllers/CourseController.ts";
import { authorize } from "../middlewares/Authorize.ts";
import { validateBody } from "../middlewares/ValidateMiddleware.ts";
import { CourseCreateSchema, CourseUpdateSchema } from "../schemas/CourseSchema.ts";
import { verifyIds } from "../middlewares/VerifyIds.ts";

const router = Router();

router.get(
  "/",
  authorize(["admin"]),
  CourseController.getCourses
);

router.post(
  "/",
  authorize(["teacher", "admin"]),
  validateBody(CourseCreateSchema),
  verifyIds({ user: true}),
  CourseController.createCourse
);
router.put(
  "/:courseId",
  authorize(["teacher", "admin"]),
  validateBody(CourseUpdateSchema),
  verifyIds({ params: ["courseId"] }),
  CourseController.updateCourse
);
router.delete(
  "/:courseId",
  authorize(["teacher", "admin"]),
  verifyIds({ params: ["courseId"] }),  
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
  verifyIds({ user: true, params: ["courseId"] }),
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
  verifyIds({ user: true, params: ["courseId"] }),
  CourseController.getCourseDetailsForTeacher
);

export default router;
