import { Router } from "express";
import { createSubject, deleteSubject, getAllSubjects, getAllSubjectsDetails, getSubjectById, updateSubject } from "../../controllers/subject/subject.controller";


const router = Router();

router.post('/create', createSubject);
router.get('/getAllSubjects', getAllSubjects);
router.get('/get-all-subjects-details', getAllSubjectsDetails);
router.get('/:subjectId', getSubjectById);
router.put('/:subjectId', updateSubject);
router.delete('/:subjectId', deleteSubject);

export default router;
