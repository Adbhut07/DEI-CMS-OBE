import { Router } from "express";
import { roleMiddleware } from "../../utils/roleMiddleware";
import { getActiveSemesters, getCurrentStudentSemesters } from "../../controllers/semester/semester.controller";
const router = Router();


// Route to get active semesters for a specific batch
router.post('/active', roleMiddleware(['Student']), getActiveSemesters);

// Route for students to get their own active semesters
router.get('/student', roleMiddleware(['Student']), getCurrentStudentSemesters);

export default router;
