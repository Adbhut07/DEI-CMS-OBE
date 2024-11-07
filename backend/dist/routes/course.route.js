"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// courseRoutes.ts
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const router = express_1.default.Router();
router.get('/', course_controller_1.getCourses);
router.get('/:id', course_controller_1.getCourseById);
router.post('/', course_controller_1.createCourse);
router.put('/:id', course_controller_1.updateCourse);
router.delete('/:id', course_controller_1.deleteCourse);
exports.default = router;
