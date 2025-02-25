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
exports.updateCOPOMappings = exports.getCOPOMappings = exports.createCOPOMapping = exports.getCourseOutcomesByCourse = exports.getProgramOutcomesByCourse = exports.getAllProgramOutcomes = exports.createProgramOutcome = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const createProgramOutcomeSchema = zod_1.default.object({
    courseId: zod_1.default.number().int().positive(),
    batchId: zod_1.default.number().int().positive(),
    description: zod_1.default.string().min(5),
});
const createProgramOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = createProgramOutcomeSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        // Verify that the batch belongs to the specified course
        const batch = yield prisma.batch.findUnique({
            where: {
                id: result.data.batchId,
                courseId: result.data.courseId
            }
        });
        if (!batch) {
            return res.status(400).json({
                success: false,
                message: "Invalid batch ID or batch does not belong to the specified course"
            });
        }
        const programOutcome = yield prisma.programOutcome.create({
            data: result.data,
            include: {
                course: true,
                batch: true
            }
        });
        return res.status(201).json({
            success: true,
            message: "Program Outcome created successfully",
            data: programOutcome,
        });
    }
    catch (error) {
        console.error("Error in createProgramOutcome", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createProgramOutcome = createProgramOutcome;
const getAllProgramOutcomes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const programOutcomes = yield prisma.programOutcome.findMany({
            include: {
                course: true,
                batch: true,
                poAttainments: true
            },
        });
        return res.status(200).json({ success: true, data: programOutcomes });
    }
    catch (error) {
        console.error("Error in getAllProgramOutcomes", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllProgramOutcomes = getAllProgramOutcomes;
const getProgramOutcomesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const batchId = parseInt(req.query.batchId);
        if (isNaN(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: "Invalid course ID" });
        }
        const whereClause = { courseId };
        if (!isNaN(batchId) && batchId > 0) {
            whereClause.batchId = batchId;
        }
        const programOutcomes = yield prisma.programOutcome.findMany({
            where: whereClause,
            include: {
                course: true,
                batch: true,
                poAttainments: true
            },
        });
        return res.status(200).json({ success: true, data: programOutcomes });
    }
    catch (error) {
        console.error("Error in getProgramOutcomesByCourse", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getProgramOutcomesByCourse = getProgramOutcomesByCourse;
const getCourseOutcomesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const batchId = parseInt(req.query.batchId);
        if (isNaN(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: "Invalid course ID" });
        }
        // Build the where clause for CourseSubject
        const whereClause = {
            courseId
        };
        if (!isNaN(batchId) && batchId > 0) {
            whereClause.batchId = batchId;
        }
        const units = yield prisma.unit.findMany({
            where: {
                subject: {
                    courseMappings: {
                        some: whereClause
                    }
                }
            },
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            where: whereClause,
                            include: {
                                batch: true
                            }
                        }
                    }
                },
                coAttainments: {
                    where: {
                        batchId: !isNaN(batchId) ? batchId : undefined
                    }
                }
            }
        });
        return res.status(200).json({ success: true, data: units });
    }
    catch (error) {
        console.error("Error in getCourseOutcomesByCourse", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getCourseOutcomesByCourse = getCourseOutcomesByCourse;
const createCOPOMappingSchema = zod_1.default.object({
    coId: zod_1.default.number().int().positive(),
    poId: zod_1.default.number().int().positive(),
    weightage: zod_1.default.number().min(0).max(1),
});
const createCOPOMapping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const batchId = parseInt(req.query.batchId);
        if (isNaN(courseId) || courseId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            });
        }
        const result = createCOPOMappingSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: result.error.format(),
            });
        }
        // Verify the Unit belongs to a subject in this course
        const courseOutcome = yield prisma.unit.findFirst({
            where: {
                id: result.data.coId,
                subject: {
                    courseMappings: {
                        some: {
                            courseId,
                            batchId: !isNaN(batchId) ? batchId : undefined
                        }
                    }
                }
            }
        });
        if (!courseOutcome) {
            return res.status(404).json({
                success: false,
                message: "Course Outcome not found or doesn't belong to this course/batch"
            });
        }
        // Verify the Program Outcome belongs to this course and batch
        const whereClause = {
            id: result.data.poId,
            courseId
        };
        if (!isNaN(batchId)) {
            whereClause.batchId = batchId;
        }
        const programOutcome = yield prisma.programOutcome.findFirst({
            where: whereClause
        });
        if (!programOutcome) {
            return res.status(404).json({
                success: false,
                message: "Program Outcome not found or doesn't belong to this course/batch"
            });
        }
        const mapping = yield prisma.cO_PO_Mapping.create({
            data: result.data,
            include: {
                courseOutcome: {
                    include: {
                        subject: true
                    }
                },
                programOutcome: {
                    include: {
                        batch: true
                    }
                }
            }
        });
        return res.status(201).json({
            success: true,
            message: "CO-PO Mapping created successfully",
            data: mapping,
        });
    }
    catch (error) {
        console.error("Error in createCOPOMapping", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createCOPOMapping = createCOPOMapping;
const getCOPOMappings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const batchId = parseInt(req.query.batchId);
        if (isNaN(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: "Invalid course ID" });
        }
        const whereClause = {
            programOutcome: {
                courseId
            }
        };
        if (!isNaN(batchId)) {
            whereClause.programOutcome.batchId = batchId;
        }
        const mappings = yield prisma.cO_PO_Mapping.findMany({
            where: whereClause,
            select: {
                weightage: true,
                programOutcome: {
                    select: {
                        id: true,
                        description: true,
                        batch: {
                            select: {
                                id: true,
                                batchYear: true
                            }
                        }
                    }
                },
                courseOutcome: {
                    select: {
                        id: true,
                        unitNumber: true,
                        description: true,
                        subject: {
                            select: {
                                id: true,
                                subjectName: true,
                                subjectCode: true
                            }
                        }
                    }
                }
            }
        });
        if (!mappings.length) {
            return res.status(404).json({
                success: false,
                message: "No CO-PO mappings found for this course/batch"
            });
        }
        const formattedMappings = mappings.map(mapping => ({
            programOutcome: {
                id: mapping.programOutcome.id,
                description: mapping.programOutcome.description,
                batch: mapping.programOutcome.batch
            },
            courseOutcome: {
                id: mapping.courseOutcome.id,
                unitNumber: mapping.courseOutcome.unitNumber,
                description: mapping.courseOutcome.description,
                subject: {
                    id: mapping.courseOutcome.subject.id,
                    name: mapping.courseOutcome.subject.subjectName,
                    code: mapping.courseOutcome.subject.subjectCode
                }
            },
            weightage: mapping.weightage
        }));
        return res.status(200).json({
            success: true,
            data: formattedMappings
        });
    }
    catch (error) {
        console.error("Error in getCOPOMappings", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getCOPOMappings = getCOPOMappings;
const updateMappingSchema = zod_1.default.object({
    coId: zod_1.default.number().int().positive(),
    poId: zod_1.default.number().int().positive(),
    weightage: zod_1.default.number().min(0).max(1)
});
const updateCOPOMappingsSchema = zod_1.default.object({
    updates: zod_1.default.array(updateMappingSchema)
});
const updateCOPOMappings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        const batchId = parseInt(req.query.batchId);
        if (isNaN(courseId) || courseId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            });
        }
        const result = updateCOPOMappingsSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format()
            });
        }
        // Verify all Units belong to subjects in this course
        const courseOutcomes = yield prisma.unit.findMany({
            where: {
                subject: {
                    courseMappings: {
                        some: {
                            courseId,
                            batchId: !isNaN(batchId) ? batchId : undefined
                        }
                    }
                }
            },
            select: { id: true }
        });
        const validCoIds = new Set(courseOutcomes.map(co => co.id));
        const invalidCOs = result.data.updates.filter(update => !validCoIds.has(update.coId));
        if (invalidCOs.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some Course Outcomes do not belong to this course/batch",
                invalidCOs: invalidCOs.map(co => co.coId)
            });
        }
        // Verify all POs belong to this course and batch
        const whereClause = { courseId };
        if (!isNaN(batchId)) {
            whereClause.batchId = batchId;
        }
        const programOutcomes = yield prisma.programOutcome.findMany({
            where: whereClause,
            select: { id: true }
        });
        const validPoIds = new Set(programOutcomes.map(po => po.id));
        const invalidPOs = result.data.updates.filter(update => !validPoIds.has(update.poId));
        if (invalidPOs.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some Program Outcomes do not belong to this course/batch",
                invalidPOs: invalidPOs.map(po => po.poId)
            });
        }
        const updateResults = yield prisma.$transaction(result.data.updates.map(update => prisma.cO_PO_Mapping.upsert({
            where: {
                coId_poId: {
                    coId: update.coId,
                    poId: update.poId
                }
            },
            update: {
                weightage: update.weightage
            },
            create: {
                coId: update.coId,
                poId: update.poId,
                weightage: update.weightage
            }
        })));
        return res.status(200).json({
            success: true,
            message: "CO-PO mappings updated successfully",
            data: updateResults
        });
    }
    catch (error) {
        console.error("Error in updateCOPOMappings:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.updateCOPOMappings = updateCOPOMappings;
