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

const router = express.Router();

router.get('/', getExams);
router.get('/:id', getExamById);
router.get('/subject/:subjectId', getExamsBySubject);
router.get('/getExamsBySubject/:subjectId', getOnlyExamsBySubject);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;
