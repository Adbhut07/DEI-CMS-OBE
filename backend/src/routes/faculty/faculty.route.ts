import { Router } from "express";
import { getAssignedSubjects } from "../../controllers/faculty/faculty.controller";
import { roleMiddleware } from "../../utils/roleMiddleware";

const router = Router();

router.get("/get-assigned-subjects", roleMiddleware(['Faculty']), getAssignedSubjects);

export default router;
