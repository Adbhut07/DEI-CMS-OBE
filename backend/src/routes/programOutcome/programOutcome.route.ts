import { Router } from 'express';
import {
  createProgramOutcome,
  getAllProgramOutcomes,
  getProgramOutcomesByCourse,
  getCourseOutcomesByCourse,
  createCOPOMapping,
  getCOPOMappings,
} from '../../controllers/programOutcome/programOutcome.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = Router();

// Program Outcomes routes
router.post('/create', roleMiddleware(['Admin', 'HOD', 'Dean']), createProgramOutcome);
router.get('/program-outcomes', roleMiddleware(['Admin', 'HOD', 'Dean']), getAllProgramOutcomes);
router.get('/course/:courseId', roleMiddleware(['Admin', 'HOD', 'Dean']), getProgramOutcomesByCourse);

// Course Outcomes routes
router.get('/course-outcomes/course/:courseId', roleMiddleware(['Admin', 'HOD', 'Dean']), getCourseOutcomesByCourse);

// CO-PO Mapping routes
router.post('/co-po-mappings/course/:courseId', roleMiddleware(['Admin', 'HOD', 'Dean']), createCOPOMapping);
router.get('/co-po-mappings/course/:courseId', roleMiddleware(['Admin', 'HOD', 'Dean']), getCOPOMappings);

export default router; 