import { Router } from "express";
import { createSubject, deleteSubject, getAllSubjects, getAllSubjectsDetails, getSubjectById, updateSubject } from "../../controllers/subject/subject.controller";
import { roleMiddleware } from "../../utils/roleMiddleware";


const router = Router();

router.post('/create', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), createSubject);
router.get('/getAllSubjects', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getAllSubjects);
router.get('/get-all-subjects-details', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getAllSubjectsDetails);
router.get('/:subjectId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getSubjectById);
router.put('/:subjectId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), updateSubject);
router.delete('/:subjectId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), deleteSubject);

export default router;
