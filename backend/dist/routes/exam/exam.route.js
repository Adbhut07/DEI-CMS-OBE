"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exam_controller_1 = require("../../controllers/exam/exam.controller");
const router = express_1.default.Router();
router.get('/', exam_controller_1.getExams);
router.get('/:id', exam_controller_1.getExamById);
router.post('/', exam_controller_1.createExam);
router.put('/:id', exam_controller_1.updateExam);
router.delete('/:id', exam_controller_1.deleteExam);
router.get('/course/:courseId/semester/:semesterId', exam_controller_1.getExamsByCourseAndSemester);
exports.default = router;
