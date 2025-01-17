"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../../controllers/course/course.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = express_1.default.Router();
router.post("/create", (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), course_controller_1.createCourse);
router.get("/getAllCourses", (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), course_controller_1.getCourses);
router.get("/getCourse/:id", (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), course_controller_1.getCourse);
router.put("/update/:id", (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), course_controller_1.updateCourse);
router.delete("/delete/:id", (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), course_controller_1.deleteCourse);
exports.default = router;
