"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const semester_controller_1 = require("../../controllers/semester/semester.controller");
const router = (0, express_1.Router)();
// Route to get active semesters for a specific batch
router.post('/active', (0, roleMiddleware_1.roleMiddleware)(['Student']), semester_controller_1.getActiveSemesters);
// Route for students to get their own active semesters
router.get('/student', (0, roleMiddleware_1.roleMiddleware)(['Student']), semester_controller_1.getCurrentStudentSemesters);
exports.default = router;
