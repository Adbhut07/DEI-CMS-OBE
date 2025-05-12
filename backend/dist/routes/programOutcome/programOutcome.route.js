"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programOutcome_controller_1 = require("../../controllers/programOutcome/programOutcome.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = (0, express_1.Router)();
// Program Outcomes routes
router.post('/create', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), programOutcome_controller_1.createProgramOutcome);
router.get('/program-outcomes', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), programOutcome_controller_1.getAllProgramOutcomes);
router.get('/course/:courseId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), programOutcome_controller_1.getProgramOutcomesByCourse);
// Course Outcomes routes
router.get('/course-outcomes/course/:courseId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), programOutcome_controller_1.getCourseOutcomesByCourse);
// CO-PO Mapping routes
router.post('/co-po-mappings/course/:courseId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), programOutcome_controller_1.createCOPOMapping);
router.get('/co-po-mappings/course/:courseId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), programOutcome_controller_1.getCOPOMappings);
exports.default = router;
