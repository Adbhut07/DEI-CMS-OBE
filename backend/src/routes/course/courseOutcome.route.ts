import express from "express";
import { calculateCOAttainment, getCOAttainment } from "../../controllers/course/courseOutcome.controller";
import { roleMiddleware } from "../../utils/roleMiddleware";

const router = express.Router();

router.post('/co', roleMiddleware(['Admin', 'HOD', 'Dean']),calculateCOAttainment);
router.get('/co/:batchId/:courseId', roleMiddleware(['Admin', 'HOD', 'Dean']), getCOAttainment);

export default router;
