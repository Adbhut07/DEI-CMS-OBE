"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const batch_controller_1 = require("../../controllers/batch/batch.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = express_1.default.Router();
router.post('/', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), batch_controller_1.createBatch);
router.get('/', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), batch_controller_1.getAllBatches);
router.get('/:batchId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), batch_controller_1.getBatchById);
router.put('/:batchId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), batch_controller_1.updateBatch);
router.delete('/:batchId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean',]), batch_controller_1.deleteBatch);
router.get('/course/:courseId', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), batch_controller_1.getBatchesByCourse);
router.get('/:batchId/students', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean', 'Faculty']), batch_controller_1.getStudentsInBatch);
exports.default = router;
