import express from 'express';
import { createUnit, updateUnit, deleteUnit, getUnit, getAllUnits } from '../../controllers/unit/unit.controller';

const router = express.Router();

router.post('/create', createUnit); 
router.put('/update/:unitId', updateUnit); 
router.delete('/delete/:unitId', deleteUnit); 
router.get('/getUnit/:unitId', getUnit); 
router.get('/getAllUnits/:subjectId', getAllUnits);

export default router;
