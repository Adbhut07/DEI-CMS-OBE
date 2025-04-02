import express from 'express';
import {
    mapCourseToSubject,
    assignFacultyToSubject,
    getSubjectsByCourse,
    getSubjectsWithUnitsByCourse,
    unmapCourseFromSubject
} from '../../controllers/course/course-subject-mapping.controller';

const router = express.Router();

router.post('/map', mapCourseToSubject);
router.post('/assign-faculty', assignFacultyToSubject);
router.get('/course/:courseId/subjects', getSubjectsByCourse);
router.get('/course/:courseId/subjects/units', getSubjectsWithUnitsByCourse);
router.delete('/unmap/:id', unmapCourseFromSubject);

export default router;
