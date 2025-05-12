import express from 'express';
import {
  createEnrollment,
  getEnrollmentsByBatch,
  getStudentEnrollment,
  removeEnrollment,
  getEnrollmentsByCourseAndBatch,
  updateEnrollmentStatus,
} from '../../controllers/enrollment/enrollment.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = express.Router();

router.post('/', roleMiddleware(['Admin', 'HOD', 'Dean']), createEnrollment);
router.get('/batch/:batchId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']),getEnrollmentsByBatch);
router.get('/student/:studentId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getStudentEnrollment);
router.get('/course/batch/:batchId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']),getEnrollmentsByCourseAndBatch); // ✅ New Route
router.delete('/:enrollmentId', roleMiddleware(['Admin', 'HOD', 'Dean']), removeEnrollment);
router.put('/:enrollmentId', roleMiddleware(['Admin', 'HOD', 'Dean']), updateEnrollmentStatus);

export default router;
