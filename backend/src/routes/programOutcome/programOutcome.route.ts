import { Router } from 'express';
import {
  createProgramOutcome,
  getAllProgramOutcomes,
  getProgramOutcomesByCourse,
  getCourseOutcomesByCourse,
  createCOPOMapping,
  getCOPOMappings,
} from '../../controllers/programOutcome/programOutcome.controller';

const router = Router();

// Program Outcomes routes
router.post('/create', createProgramOutcome);
router.get('/program-outcomes', getAllProgramOutcomes);
router.get('/course/:courseId', getProgramOutcomesByCourse);

// Course Outcomes routes
router.get('/course-outcomes/course/:courseId', getCourseOutcomesByCourse);

// CO-PO Mapping routes
router.post('/co-po-mappings/course/:courseId', createCOPOMapping);
router.get('/co-po-mappings/course/:courseId', getCOPOMappings);

export default router; 