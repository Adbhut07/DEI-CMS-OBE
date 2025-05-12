import express from 'express';
import {
    mapCourseToSubject,
    assignFacultyToSubject,
    getSubjectsByCourse,
    getSubjectsWithUnitsByCourse,
    unmapCourseFromSubject
} from '../../controllers/course/course-subject-mapping.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = express.Router();

router.post('/map',roleMiddleware(['Admin', 'HOD', 'Dean']), mapCourseToSubject);
router.post('/assign-faculty',roleMiddleware(['Admin', 'HOD', 'Dean']), assignFacultyToSubject);
router.get('/course/:courseId/subjects',roleMiddleware(['Admin', 'HOD', 'Dean']), getSubjectsByCourse);
router.get('/course/:courseId/subjects/units',roleMiddleware(['Admin', 'HOD', 'Dean']), getSubjectsWithUnitsByCourse);
router.delete('/unmap/:id',roleMiddleware(['Admin', 'HOD', 'Dean']), unmapCourseFromSubject);

export default router;
