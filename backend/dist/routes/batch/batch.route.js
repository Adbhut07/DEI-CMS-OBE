"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const batch_controller_1 = require("../../controllers/batch/batch.controller");
const router = express_1.default.Router();
router.post('/', batch_controller_1.createBatch);
router.get('/', batch_controller_1.getAllBatches);
router.get('/:batchId', batch_controller_1.getBatchById);
router.put('/:batchId', batch_controller_1.updateBatch);
router.delete('/:batchId', batch_controller_1.deleteBatch);
router.get('/course/:courseId', batch_controller_1.getBatchesByCourse);
router.get('/:batchId/students', batch_controller_1.getStudentsInBatch);
exports.default = router;
