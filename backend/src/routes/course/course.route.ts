import express from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from "../../controllers/course/course.controller";
import { roleMiddleware } from "../../utils/roleMiddleware";

const router = express.Router();

router.post("/create",roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), createCourse);
router.get("/getAllCourses", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getAllCourses);
router.get("/getCourse/:courseId", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']),  getCourseById);
router.put("/update/:courseId", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), updateCourse);
router.delete("/delete/:courseId", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), deleteCourse);

export default router;
