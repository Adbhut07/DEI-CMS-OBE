"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programOutcome_controller_1 = require("../../controllers/programOutcome/programOutcome.controller");
const router = (0, express_1.Router)();
// Program Outcomes routes
router.post('/create', programOutcome_controller_1.createProgramOutcome);
router.get('/program-outcomes', programOutcome_controller_1.getAllProgramOutcomes);
router.get('/course/:courseId', programOutcome_controller_1.getProgramOutcomesByCourse);
// Course Outcomes routes
router.get('/course-outcomes/course/:courseId', programOutcome_controller_1.getCourseOutcomesByCourse);
// CO-PO Mapping routes
router.post('/co-po-mappings/course/:courseId', programOutcome_controller_1.createCOPOMapping);
router.get('/co-po-mappings/course/:courseId', programOutcome_controller_1.getCOPOMappings);
exports.default = router;
