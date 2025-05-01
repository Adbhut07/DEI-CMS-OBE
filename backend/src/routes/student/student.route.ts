// routes/studentRoutes.ts

import { Router } from "express";
import { getStudentDetails, getStudentMarksBySemester } from "../../controllers/student/student.controller";
import { roleMiddleware } from "../../utils/roleMiddleware";
const router = Router();



router.get("/details", roleMiddleware(['Student']), getStudentDetails);

router.post("/marks", roleMiddleware(['Student']), getStudentMarksBySemester );

export default router;
