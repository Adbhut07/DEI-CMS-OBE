"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// enrollmentRoutes.ts
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("../../controllers/enrollment/enrollment.controller");
const router = express_1.default.Router();
router.post('/', enrollment_controller_1.createEnrollment);
router.get('/', enrollment_controller_1.getAllEnrollments);
router.get('/getEnrollment/:id', enrollment_controller_1.getEnrollmentById);
router.put('/:id', enrollment_controller_1.updateEnrollment);
router.delete('/:id', enrollment_controller_1.deleteEnrollment);
router.get('/course/:courseId', enrollment_controller_1.getEnrollmentsByCourseId);
exports.default = router;
