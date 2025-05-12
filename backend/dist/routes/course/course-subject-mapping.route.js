"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_subject_mapping_controller_1 = require("../../controllers/course/course-subject-mapping.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = express_1.default.Router();
router.post('/map', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), course_subject_mapping_controller_1.mapCourseToSubject);
router.post('/assign-faculty', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), course_subject_mapping_controller_1.assignFacultyToSubject);
router.get('/course/:courseId/subjects', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), course_subject_mapping_controller_1.getSubjectsByCourse);
router.get('/course/:courseId/subjects/units', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), course_subject_mapping_controller_1.getSubjectsWithUnitsByCourse);
router.delete('/unmap/:id', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), course_subject_mapping_controller_1.unmapCourseFromSubject);
exports.default = router;
