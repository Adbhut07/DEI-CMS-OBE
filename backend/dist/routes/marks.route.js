"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// marksRoutes.ts
const express_1 = __importDefault(require("express"));
const marks_controller_1 = require("../controllers/marks.controller");
const router = express_1.default.Router();
router.get('/', marks_controller_1.getMarks);
router.get('/student/:studentId', marks_controller_1.getMarksByStudentId);
router.post('/', marks_controller_1.createMarks);
router.put('/:id', marks_controller_1.updateMarks);
router.delete('/:id', marks_controller_1.deleteMarks);
exports.default = router;
