import express from "express";
import { createCourse, deleteCourse, getCourse, getCourses, updateCourse } from "../../controllers/course/course.controller";

const router = express.Router();

router.post("/create", createCourse);
router.get("/getAllCourses", getCourses);
router.get("/getCourse/:id", getCourse);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

export default router;
