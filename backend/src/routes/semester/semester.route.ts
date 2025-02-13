import express from 'express';
import {
  getSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
} from '../../controllers/semester/semester.controller';

const router = express.Router();

router.get('/', getSemesters);
router.get('/:id', getSemesterById);
router.post('/', createSemester);
router.put('/:id', updateSemester);
router.delete('/:id', deleteSemester);

export default router;
