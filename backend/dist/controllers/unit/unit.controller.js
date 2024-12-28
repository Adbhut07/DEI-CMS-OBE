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
exports.getAllUnits = exports.getUnit = exports.deleteUnit = exports.updateUnit = exports.createUnit = void 0;
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
                semester: {
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
        if (!subject.semester) {
            return res.status(400).json({
                success: false,
                message: "Subject is not associated with any semester",
            });
        }
        const unit = yield prisma.unit.create({
            data: {
                unitNumber,
                subjectId,
                description,
            },
            select: {
                id: true,
                unitNumber: true,
                subjectId: true,
                description: true,
                createdAt: true,
                updatedAt: true,
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
                semester: {
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
        if (!subject.semester) {
            return res.status(400).json({
                success: false,
                message: "The subject is not associated with a valid semester",
            });
        }
        const updatedUnit = yield prisma.unit.update({
            where: { id: Number(unitId) },
            data: {
                unitNumber,
                subjectId,
                description,
            },
            select: {
                id: true,
                unitNumber: true,
                description: true,
                subjectId: true,
                updatedAt: true,
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
const deleteUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        yield prisma.unit.delete({
            where: { id: Number(unitId) },
        });
        return res.status(200).json({
            success: true,
            message: "Unit deleted successfully",
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
const getUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unitId } = req.params;
        const unit = yield prisma.unit.findUnique({
            where: { id: Number(unitId) },
            include: {
                subject: true,
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
                semester: true,
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
                subject: true,
            },
            orderBy: {
                unitNumber: 'asc',
            },
        });
        if (units.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No units found for this subject",
            });
        }
        return res.status(200).json({
            success: true,
            data: units,
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
