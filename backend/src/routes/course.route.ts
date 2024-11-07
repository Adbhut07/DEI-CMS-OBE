// courseRoutes.ts
import express from 'express';
import {
    getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller';

const router = express.Router();

router.get('/', getCourses); 
router.get('/:id', getCourseById); 
router.post('/', createCourse); 
router.put('/:id', updateCourse); 
router.delete('/:id', deleteCourse);

export default router;
