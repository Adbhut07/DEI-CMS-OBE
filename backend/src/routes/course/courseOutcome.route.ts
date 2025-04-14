import express from "express";
import { calculateCOAttainment, getCOAttainment } from "../../controllers/course/courseOutcome.controller";

const router = express.Router();

router.post('/co',calculateCOAttainment);
router.get('/co/:batchId/:courseId', getCOAttainment);

export default router;
