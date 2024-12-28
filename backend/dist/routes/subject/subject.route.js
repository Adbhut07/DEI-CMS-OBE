"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = require("../../controllers/subject/subject.controller");
const router = (0, express_1.Router)();
router.post("/create", subject_controller_1.createSubject);
router.post("/:subjectId/assign-faculty", subject_controller_1.assignFacultyToSubject);
router.get("/getAll", subject_controller_1.getSubjects); //pass semester id in query for getting subjects of a course
router.get("/getSubject/:id", subject_controller_1.getSubject);
router.patch("/:id", subject_controller_1.updateSubject);
router.delete("/:id", subject_controller_1.deleteSubject);
exports.default = router;
