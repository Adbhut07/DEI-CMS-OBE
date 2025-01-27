// enrollmentRoutes.ts
import express from 'express';
import { createEnrollment, deleteEnrollment, getAllEnrollments, getEnrollmentById, getEnrollmentsByCourseId, getStudentsBySubjectAndCourse, updateEnrollment } from '../../controllers/enrollment/enrollment.controller';

const router = express.Router();

router.post('/', createEnrollment);
router.get('/', getAllEnrollments);
router.get('/students/:subjectId/:courseId', getStudentsBySubjectAndCourse);
router.get('/getEnrollment/:id', getEnrollmentById);
router.put('/:id', updateEnrollment);
router.delete('/:id', deleteEnrollment);
router.get('/course/:courseId', getEnrollmentsByCourseId);

export default router;
