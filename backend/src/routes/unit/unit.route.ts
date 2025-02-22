import express from 'express';
import { createUnit, updateUnit, getUnit, getAllUnits, bulkCreateUnits, getUnitsByCourse, bulkDeleteUnits, reorderUnits, deleteUnit } from '../../controllers/unit/unit.controller';

const router = express.Router();

//create
router.post('/create', createUnit); 
router.post('/bulkCreate', bulkCreateUnits);

//update
router.put('/update/:unitId', updateUnit); 
router.put("/reorder", reorderUnits);

//delete
router.delete('/:unitId', deleteUnit);
router.delete('/bulk', bulkDeleteUnits);

//get
router.get('/getUnit/:unitId', getUnit); 
router.get('/getAllUnits/:subjectId', getAllUnits);
router.get("/course/:courseId", getUnitsByCourse);

export default router;
