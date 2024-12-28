"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseOutcome_controller_1 = require("../../controllers/course/courseOutcome.controller");
const router = express_1.default.Router();
router.post("/create", courseOutcome_controller_1.createCourseOutcome);
router.get('/getCO/:subjectId/:semesterId', courseOutcome_controller_1.getCourseOutcomesBySubject);
router.get('/getACO/:id', courseOutcome_controller_1.getCourseOutcome);
router.put('/update/:id', courseOutcome_controller_1.createCourseOutcome);
router.delete('/delete/:id', courseOutcome_controller_1.createCourseOutcome);
exports.default = router;
