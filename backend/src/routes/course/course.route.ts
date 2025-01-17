import express from "express";
import { createCourse, deleteCourse, getCourse, getCourses, updateCourse } from "../../controllers/course/course.controller";
import { roleMiddleware } from "../../utils/roleMiddleware";

const router = express.Router();

router.post("/create",roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), createCourse);
router.get("/getAllCourses", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getCourses);
router.get("/getCourse/:id", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']),  getCourse);
router.put("/update/:id", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), updateCourse);
router.delete("/delete/:id", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), deleteCourse);

export default router;
