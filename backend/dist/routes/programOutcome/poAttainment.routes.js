"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const POAttainment_controller_1 = require("../../controllers/programOutcome/POAttainment.controller");
const roleMiddleware_1 = require("../../utils/roleMiddleware");
const router = express_1.default.Router();
// Calculate PO attainment based on CO attainments and CO-PO mappings
router.post('/calculate', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), POAttainment_controller_1.calculatePOAttainment);
// Get PO attainment matrix with discrete levels (0-3)
router.get('/:courseId/matrix', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), POAttainment_controller_1.getPOAttainmentMatrix);
// Update CO-PO mappings using discrete levels (0-3) instead of decimal weightage
router.put('/:courseId/co-po-mapping', (0, roleMiddleware_1.roleMiddleware)(['Admin', 'HOD', 'Dean']), POAttainment_controller_1.updateCOPOMappings);
exports.default = router;
