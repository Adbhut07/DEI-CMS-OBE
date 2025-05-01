"use strict";
// routes/studentRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../../controllers/student/student.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = (0, express_1.Router)();
router.get("/details", (0, roleMiddleware_1.roleMiddleware)(['Student']), student_controller_1.getStudentDetails);
router.post("/marks", (0, roleMiddleware_1.roleMiddleware)(['Student']), student_controller_1.getStudentMarksBySemester);
exports.default = router;
