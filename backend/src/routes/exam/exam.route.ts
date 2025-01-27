import express from 'express';
import {
    getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamsByCourseAndSemester,
} from '../../controllers/exam/exam.controller';

const router = express.Router();

router.get('/', getExams);
router.get('/:id', getExamById);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);
router.get('/course/:courseId/semester/:semesterId', getExamsByCourseAndSemester);


export default router;
