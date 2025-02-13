"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marks_controller_1 = require("../../controllers/marks/marks.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = (0, express_1.Router)();
router.post('/upload', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), marks_controller_1.uploadMarks);
router.get('/:examId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), marks_controller_1.getMarksByExam);
router.put('/:examId/:studentId/:questionId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), marks_controller_1.updateMarks);
router.delete('/:examId/:studentId/:questionId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), marks_controller_1.deleteMarks);
router.get('/getMarksByBatch/:batchId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), marks_controller_1.getMarksByBatch);
exports.default = router;
