import express from 'express';
import { createUnit, updateUnit, getUnit, getAllUnits, bulkCreateUnits, getUnitsByCourse, bulkDeleteUnits, reorderUnits, deleteUnit } from '../../controllers/unit/unit.controller';
import { roleMiddleware } from '../../utils/roleMiddleware';

const router = express.Router();

//create
router.post('/create', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), createUnit); 
router.post('/bulkCreate', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), bulkCreateUnits);

//update
router.put('/update/:unitId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), updateUnit); 
router.put("/reorder", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), reorderUnits);

//delete
router.delete('/:unitId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), deleteUnit);
router.delete('/bulk', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), bulkDeleteUnits);

//get
router.get('/getUnit/:unitId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getUnit); 
router.get('/getAllUnits/:subjectId', roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getAllUnits);
router.get("/course/:courseId", roleMiddleware(['Admin', 'HOD', 'Dean', 'Faculty']), getUnitsByCourse);

export default router;
