"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// subjectRoutes.ts
const express_1 = __importDefault(require("express"));
const subject_controller_1 = require("../controllers/subject.controller");
const router = express_1.default.Router();
router.get('/', subject_controller_1.getSubjects);
router.get('/:id', subject_controller_1.getSubjectById);
router.post('/', subject_controller_1.createSubject);
router.put('/:id', subject_controller_1.updateSubject);
router.delete('/:id', subject_controller_1.deleteSubject);
exports.default = router;
