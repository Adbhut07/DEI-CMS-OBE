import express from 'express';
import {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  getBatchesByCourse,
  getStudentsInBatch,
} from '../../controllers/batch/batch.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = express.Router();

router.post('/', roleMiddleware(['Admin', 'HOD', 'Dean']), createBatch);
router.get('/', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']),getAllBatches);
router.get('/:batchId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getBatchById);
router.put('/:batchId', roleMiddleware(['Admin', 'HOD', 'Dean']), updateBatch);
router.delete('/:batchId', roleMiddleware(['Admin', 'HOD', 'Dean',]), deleteBatch);
router.get('/course/:courseId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getBatchesByCourse);
router.get('/:batchId/students', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getStudentsInBatch);

export default router;
