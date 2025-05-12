import express from 'express';
import {
    getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamsBySubject,
  getOnlyExamsBySubject,
} from '../../controllers/exam/exam.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = express.Router();

router.get('/', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getExams);
router.get('/:id', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getExamById);
router.get('/subject/:subjectId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getExamsBySubject);
router.get('/getExamsBySubject/:subjectId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getOnlyExamsBySubject);
router.post('/', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), createExam);
router.put('/:id', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), updateExam);
router.delete('/:id', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), deleteExam);

export default router;
