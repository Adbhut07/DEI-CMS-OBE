import { Router } from 'express';
import {
  uploadMarks,
  getMarksByExam,
  updateMarks,
  deleteMarks,
  getMarksByBatch,
} from '../../controllers/marks/marks.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = Router();

router.post('/upload', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), uploadMarks);
router.get('/:examId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getMarksByExam);
router.put('/:examId/:studentId/:questionId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), updateMarks);
router.delete('/:examId/:studentId/:questionId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), deleteMarks);
router.get('/getMarksByBatch/:batchId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getMarksByBatch);

export default router;
