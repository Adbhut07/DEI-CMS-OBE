"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const unit_controller_1 = require("../../controllers/unit/unit.controller");
const router = express_1.default.Router();
//create
router.post('/create', unit_controller_1.createUnit);
router.post('/bulkCreate', unit_controller_1.bulkCreateUnits);
//update
router.put('/update/:unitId', unit_controller_1.updateUnit);
router.put("/reorder", unit_controller_1.reorderUnits);
//delete
router.delete('/:unitId', unit_controller_1.deleteUnit);
router.delete('/bulk', unit_controller_1.bulkDeleteUnits);
//get
router.get('/getUnit/:unitId', unit_controller_1.getUnit);
router.get('/getAllUnits/:subjectId', unit_controller_1.getAllUnits);
router.get("/course/:courseId", unit_controller_1.getUnitsByCourse);
exports.default = router;
