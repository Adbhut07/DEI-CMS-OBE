import express from 'express';
import {
  createEnrollment,
  getEnrollmentsByBatch,
  getStudentEnrollment,
  removeEnrollment,
  getEnrollmentsByCourseAndBatch,
} from '../../controllers/enrollment/enrollment.controller';

const router = express.Router();

router.post('/', createEnrollment);
router.get('/batch/:batchId', getEnrollmentsByBatch);
router.get('/student/:studentId', getStudentEnrollment);
router.get('/course/batch/:batchId', getEnrollmentsByCourseAndBatch); // ✅ New Route
router.delete('/:enrollmentId', removeEnrollment);

export default router;
