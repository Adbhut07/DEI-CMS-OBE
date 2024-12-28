import express from "express";
import { createCourse, deleteCourse, getCourse, getCourses, updateCourse } from "../../controllers/course/course.controller";
import { roleMiddleware } from "../../utils/roleMiddleware";

const router = express.Router();

router.post("/create", roleMiddleware(['Admin']), createCourse);
router.get("/getAllCourses", roleMiddleware(['Admin']), getCourses);
router.get("/getCourse/:id", getCourse);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

export default router;
