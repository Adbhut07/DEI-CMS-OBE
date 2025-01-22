"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faculty_controller_1 = require("../../controllers/faculty/faculty.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = (0, express_1.Router)();
router.get("/get-assigned-subjects", (0, roleMiddleware_1.roleMiddleware)(['Faculty']), faculty_controller_1.getAssignedSubjects);
exports.default = router;
