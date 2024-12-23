import { Router } from "express";
import { assignFacultyToSubject, createSubject, deleteSubject, getSubject, getSubjects, updateSubject } from "../../controllers/subject/subject.controller";


const router = Router();

router.post("/create", createSubject);
router.post("/:subjectId/assign-faculty", assignFacultyToSubject);
router.get("/getAll", getSubjects); //pass semester id in query for getting subjects of a course
router.get("/getSubject/:id", getSubject);
router.patch("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
