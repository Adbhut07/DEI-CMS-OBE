"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("../../controllers/enrollment/enrollment.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = express_1.default.Router();
router.post('/', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), enrollment_controller_1.createEnrollment);
router.get('/batch/:batchId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), enrollment_controller_1.getEnrollmentsByBatch);
router.get('/student/:studentId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), enrollment_controller_1.getStudentEnrollment);
router.get('/course/batch/:batchId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), enrollment_controller_1.getEnrollmentsByCourseAndBatch); // ✅ New Route
router.delete('/:enrollmentId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), enrollment_controller_1.removeEnrollment);
router.put('/:enrollmentId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), enrollment_controller_1.updateEnrollmentStatus);
exports.default = router;
