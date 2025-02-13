import express from 'express';
import { createUnit, updateUnit, deleteUnit, getUnit, getAllUnits, bulkCreateUnits, getUnitsBySemester, getUnitsByCourse, bulkDeleteUnits, reorderUnits } from '../../controllers/unit/unit.controller';

const router = express.Router();

router.post('/create', createUnit); 
router.put('/update/:unitId', updateUnit); 
router.delete('/delete/:unitId', deleteUnit); 
router.get('/getUnit/:unitId', getUnit); 
router.get('/getAllUnits/:subjectId', getAllUnits);
router.post("/bulk", bulkCreateUnits);
router.get("/semester/:semesterId", getUnitsBySemester);
router.get("/course/:courseId", getUnitsByCourse);
router.delete("/bulk", bulkDeleteUnits);
router.put("/reorder", reorderUnits);

export default router;
