import express from "express";
import { calculateCOAttainment } from "../../controllers/course/courseOutcome.controller";

const router = express.Router();

router.post('/co',calculateCOAttainment);

export default router;
