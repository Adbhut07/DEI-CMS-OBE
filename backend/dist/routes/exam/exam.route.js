"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exam_controller_1 = require("../../controllers/exam/exam.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = express_1.default.Router();
router.get('/', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), exam_controller_1.getExams);
router.get('/:id', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), exam_controller_1.getExamById);
router.get('/subject/:subjectId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), exam_controller_1.getExamsBySubject);
router.get('/getExamsBySubject/:subjectId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), exam_controller_1.getOnlyExamsBySubject);
router.post('/', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), exam_controller_1.createExam);
router.put('/:id', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), exam_controller_1.updateExam);
router.delete('/:id', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), exam_controller_1.deleteExam);
exports.default = router;
