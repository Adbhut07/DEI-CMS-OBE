"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("../../controllers/enrollment/enrollment.controller");
const router = express_1.default.Router();
router.post('/', enrollment_controller_1.createEnrollment);
router.get('/batch/:batchId', enrollment_controller_1.getEnrollmentsByBatch);
router.get('/student/:studentId', enrollment_controller_1.getStudentEnrollment);
router.get('/course/batch/:batchId', enrollment_controller_1.getEnrollmentsByCourseAndBatch); // ✅ New Route
router.delete('/:enrollmentId', enrollment_controller_1.removeEnrollment);
router.put('/:enrollmentId', enrollment_controller_1.updateEnrollmentStatus);
exports.default = router;
