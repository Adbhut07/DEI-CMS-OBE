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

const router = express.Router();

router.post('/', createBatch);
router.get('/', getAllBatches);
router.get('/:batchId', getBatchById);
router.put('/:batchId', updateBatch);
router.delete('/:batchId', deleteBatch);
router.get('/course/:courseId', getBatchesByCourse);
router.get('/:batchId/students', getStudentsInBatch);

export default router;
