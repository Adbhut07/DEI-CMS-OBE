import express from 'express';
import { 
  calculatePOAttainment, 
  getPOAttainmentMatrix,
  updateCOPOMappings 
} from '../../controllers/programOutcome/POAttainment.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = express.Router();

// Calculate PO attainment based on CO attainments and CO-PO mappings
router.post('/calculate', roleMiddleware(['Admin', 'HOD', 'Dean']), calculatePOAttainment);

// Get PO attainment matrix with discrete levels (0-3)
router.get('/:courseId/matrix', roleMiddleware(['Admin', 'HOD', 'Dean']), getPOAttainmentMatrix);

// Update CO-PO mappings using discrete levels (0-3) instead of decimal weightage
router.put('/:courseId/co-po-mapping', roleMiddleware(['Admin', 'HOD', 'Dean']), updateCOPOMappings);

export default router;