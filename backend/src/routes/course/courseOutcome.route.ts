import express from "express";
import { createCourseOutcome, getCourseOutcome, getCourseOutcomesBySubject } from "../../controllers/course/courseOutcome.controller";

const router = express.Router();

router.post("/create", createCourseOutcome);
router.get('/getCO/:subjectId/:semesterId', getCourseOutcomesBySubject);
router.get('/getACO/:id', getCourseOutcome);
router.put('/update/:id', createCourseOutcome);
router.delete('/delete/:id', createCourseOutcome);

export default router;
