"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// semesterRoutes.ts
const express_1 = __importDefault(require("express"));
const semester_controller_1 = require("../controllers/semester.controller");
const router = express_1.default.Router();
router.get('/', semester_controller_1.getSemesters);
router.get('/:id', semester_controller_1.getSemesterById);
router.post('/', semester_controller_1.createSemester);
router.put('/:id', semester_controller_1.updateSemester);
router.delete('/:id', semester_controller_1.deleteSemester);
exports.default = router;
