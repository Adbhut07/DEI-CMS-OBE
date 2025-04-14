"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseOutcome_controller_1 = require("../../controllers/course/courseOutcome.controller");
const router = express_1.default.Router();
router.post('/co', courseOutcome_controller_1.calculateCOAttainment);
router.get('/co/:batchId/:courseId', courseOutcome_controller_1.getCOAttainment);
exports.default = router;
