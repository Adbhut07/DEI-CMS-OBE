"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// questionRoutes.ts
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("../controllers/question.controller");
const router = express_1.default.Router();
router.get('/', question_controller_1.getQuestions);
router.get('/:id', question_controller_1.getQuestionById);
router.post('/', question_controller_1.createQuestion);
router.put('/:id', question_controller_1.updateQuestion);
router.delete('/:id', question_controller_1.deleteQuestion);
exports.default = router;
