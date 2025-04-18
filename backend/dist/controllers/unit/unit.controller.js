"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderUnits = exports.deleteUnit = exports.bulkDeleteUnits = exports.getUnitsByCourse = exports.bulkCreateUnits = exports.getAllUnits = exports.getUnit = exports.updateUnit = exports.createUnit = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const createUnitSchema = zod_1.default.object({
    unitNumber: zod_1.default.number().min(1, "Unit number must be greater than 0"),
    subjectId: zod_1.default.number().int().positive("Subject ID must be a positive integer"),
    description: zod_1.default.string().optional(),
});
const updateUnitSchema = zod_1.default.object({
    unitNumber: zod_1.default.number().min(1, "Unit number must be greater than 0"),
    subjectId: zod_1.default.number().int().positive("Subject ID must be a positive integer"),
    description: zod_1.default.string().optional(),
});
const bulkCreateUnitsSchema = zod_1.default.array(zod_1.default.object({
    unitNumber: zod_1.default.number().min(1, "Unit number must be greater than 0"),
    subjectId: zod_1.default.number().int().positive("Subject ID must be a positive integer"),
    description: zod_1.default.string().optional(),
}));
const createUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = createUnitSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { unitNumber, subjectId, description } = result.data;
        const subject = yield prisma.subject.findUnique({
            where: { id: subjectId },
            include: {
                courseMappings: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        const existingUnit = yield prisma.unit.findFirst({
            where: {
                unitNumber,
                subjectId,
            },
        });
        if (existingUnit) {
            return res.status(409).json({
                success: false,
                message: `Unit number ${unitNumber} already exists for this subject`,
            });
        }
        const unit = yield prisma.unit.create({
            data: {
                unitNumber,
                subjectId,
                description,
            },
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            include: {
                                course: true,
                                faculty: true,
                            },
                        },
                    },
                },
                coMappings: {
                    include: {
                        programOutcome: true,
                    },
                },
                questions: {
                    include: {
                        exam: true,
                    },
                },
                coAttainments: true,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Unit created successfully",
            data: unit,
        });
    }
    catch (error) {
        console.error("Error in createUnit controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.createUnit = createUnit;
const updateUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = updateUnitSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { unitNumber, subjectId, description } = result.data;
        const { unitId } = req.params;
        const unit = yield prisma.unit.findUnique({
            where: { id: Number(unitId) },
        });
        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }
        const subject = yield prisma.subject.findUnique({
            where: { id: subjectId },
            include: {
                courseMappings: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        const existingUnit = yield prisma.unit.findFirst({
            where: {
                unitNumber,
                subjectId,
                id: {
                    not: Number(unitId)
                }
            },
        });
        if (existingUnit) {
            return res.status(409).json({
                success: false,
                message: `Unit number ${unitNumber} already exists for this subject`,
            });
        }
        const updatedUnit = yield prisma.unit.update({
            where: { id: Number(unitId) },
            data: {
                unitNumber,
                subjectId,
                description,
            },
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            include: {
                                course: true,
                                faculty: true,
                            },
                        },
                    },
                },
                coMappings: {
                    include: {
                        programOutcome: true,
                    },
                },
                questions: {
                    include: {
                        exam: true,
                    },
                },
                coAttainments: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Unit updated successfully",
            data: updatedUnit,
        });
    }
    catch (error) {
        console.error("Error in updateUnit controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateUnit = updateUnit;
const getUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitId } = req.params;
        const unit = yield prisma.unit.findUnique({
            where: { id: Number(unitId) },
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            include: {
                                course: true,
                                faculty: true,
                                batch: true,
                            },
                        },
                    },
                },
                coMappings: {
                    include: {
                        programOutcome: true,
                    },
                },
                questions: {
                    include: {
                        exam: true,
                    },
                },
                coAttainments: true,
            },
        });
        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: unit,
        });
    }
    catch (error) {
        console.error("Error in getUnit controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getUnit = getUnit;
const getAllUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId } = req.params;
        if (isNaN(Number(subjectId))) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject ID",
            });
        }
        const subject = yield prisma.subject.findUnique({
            where: { id: Number(subjectId) },
            include: {
                courseMappings: true,
            },
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        const units = yield prisma.unit.findMany({
            where: {
                subjectId: Number(subjectId),
            },
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            include: {
                                course: true,
                                faculty: true,
                                batch: true,
                            },
                        },
                    },
                },
                coMappings: {
                    include: {
                        programOutcome: true,
                    },
                },
                questions: {
                    include: {
                        exam: true,
                    },
                },
                coAttainments: true,
            },
            orderBy: {
                unitNumber: 'asc',
            },
        });
        return res.status(200).json({
            success: true,
            data: units,
            message: units.length === 0 ? "No units found for this subject" : undefined,
        });
    }
    catch (error) {
        console.error("Error in getAllUnits controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getAllUnits = getAllUnits;
const bulkCreateUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = bulkCreateUnitsSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const unitsToCreate = result.data;
        // Check for duplicate unit numbers within the same subject in the request
        const duplicatesInRequest = findDuplicatesInBulkCreate(unitsToCreate);
        if (duplicatesInRequest.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Duplicate unit numbers detected in request",
                duplicates: duplicatesInRequest,
            });
        }
        // Check against existing units in the database
        const existingConflicts = [];
        for (const unit of unitsToCreate) {
            const existingUnit = yield prisma.unit.findFirst({
                where: {
                    unitNumber: unit.unitNumber,
                    subjectId: unit.subjectId,
                },
            });
            if (existingUnit) {
                existingConflicts.push({
                    subjectId: unit.subjectId,
                    unitNumber: unit.unitNumber
                });
            }
        }
        if (existingConflicts.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Some units already exist with the same unit number for the subject",
                conflicts: existingConflicts,
            });
        }
        const createdUnits = yield prisma.unit.createMany({
            data: unitsToCreate,
        });
        return res.status(201).json({
            success: true,
            message: "Units created successfully",
            data: createdUnits,
        });
    }
    catch (error) {
        console.error("Error in bulkCreateUnits controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.bulkCreateUnits = bulkCreateUnits;
function findDuplicatesInBulkCreate(units) {
    const uniqueKeys = new Map();
    const duplicates = [];
    for (const unit of units) {
        const key = `${unit.subjectId}-${unit.unitNumber}`;
        if (uniqueKeys.has(key)) {
            duplicates.push(unit);
        }
        else {
            uniqueKeys.set(key, unit);
        }
    }
    return duplicates;
}
const getUnitsByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const units = yield prisma.unit.findMany({
            where: {
                subject: {
                    courseMappings: {
                        some: {
                            courseId: Number(courseId),
                        },
                    },
                },
            },
            include: {
                subject: {
                    include: {
                    // courseMappings: {
                    //   include: {
                    //     course: true,
                    //     faculty: true,
                    //     batch: true,
                    //   },
                    // },
                    },
                },
            },
        });
        return res.status(200).json({ success: true, data: units });
    }
    catch (error) {
        console.error("Error in getUnitsByCourse controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getUnitsByCourse = getUnitsByCourse;
const bulkDeleteUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitIds } = req.body;
        if (!Array.isArray(unitIds) || unitIds.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid unit IDs" });
        }
        // Convert unitIds to numbers & filter out NaNs
        const validUnitIds = unitIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
        if (validUnitIds.length === 0) {
            return res.status(400).json({ success: false, message: "No valid unit IDs provided" });
        }
        // Check if units exist before deleting
        const existingUnits = yield prisma.unit.findMany({
            where: { id: { in: validUnitIds } }
        });
        if (existingUnits.length === 0) {
            return res.status(404).json({ success: false, message: "No valid units found to delete" });
        }
        // Delete units
        yield prisma.unit.deleteMany({
            where: { id: { in: validUnitIds } }
        });
        return res.status(200).json({ success: true, message: "Units deleted successfully" });
    }
    catch (error) {
        console.error("Error in bulkDeleteUnits controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.bulkDeleteUnits = bulkDeleteUnits;
const deleteUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitId } = req.params;
        const unit = yield prisma.unit.findUnique({
            where: { id: Number(unitId) },
            include: {
                coMappings: true,
                questions: true,
                coAttainments: true,
            }
        });
        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }
        // Delete related records in a transaction to maintain data consistency
        yield prisma.$transaction([
            // Delete CO-PO mappings
            prisma.cO_PO_Mapping.deleteMany({
                where: { coId: Number(unitId) }
            }),
            // Delete CO attainments
            prisma.cO_Attainment.deleteMany({
                where: { coId: Number(unitId) }
            }),
            // Delete questions
            prisma.question.deleteMany({
                where: { unitId: Number(unitId) }
            }),
            // Finally delete the unit
            prisma.unit.delete({
                where: { id: Number(unitId) }
            })
        ]);
        return res.status(200).json({
            success: true,
            message: "Unit and related records deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteUnit controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.deleteUnit = deleteUnit;
const reorderUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitOrders } = req.body;
        if (!Array.isArray(unitOrders) || unitOrders.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid unit order data" });
        }
        // Check for duplicate unit numbers after reordering
        const unitIds = unitOrders.map(order => order.unitId);
        // Get all units to be reordered
        const unitsToUpdate = yield prisma.unit.findMany({
            where: { id: { in: unitIds } }
        });
        // Group units by subject ID to ensure we don't create duplicates within the same subject
        const unitsBySubject = new Map();
        for (const unit of unitsToUpdate) {
            if (!unitsBySubject.has(unit.subjectId)) {
                unitsBySubject.set(unit.subjectId, new Set());
            }
        }
        // Check for potential duplicates after reordering
        for (const order of unitOrders) {
            const unit = unitsToUpdate.find(u => u.id === order.unitId);
            if (!unit)
                continue;
            const subjectUnits = unitsBySubject.get(unit.subjectId);
            if (subjectUnits.has(order.newOrder)) {
                return res.status(409).json({
                    success: false,
                    message: "Reordering would create duplicate unit numbers within the same subject",
                    conflict: {
                        subjectId: unit.subjectId,
                        unitNumber: order.newOrder
                    }
                });
            }
            subjectUnits.add(order.newOrder);
        }
        const updatePromises = unitOrders.map(({ unitId, newOrder }) => prisma.unit.update({
            where: { id: unitId },
            data: { unitNumber: newOrder },
        }));
        yield Promise.all(updatePromises);
        return res.status(200).json({ success: true, message: "Units reordered successfully" });
    }
    catch (error) {
        console.error("Error in reorderUnits controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.reorderUnits = reorderUnits;
