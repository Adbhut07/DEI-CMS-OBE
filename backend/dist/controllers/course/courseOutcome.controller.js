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
exports.deleteCourseOutcome = exports.updateCourseOutcome = exports.getCourseOutcome = exports.getCourseOutcomesBySubject = exports.createCourseOutcome = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const courseOutcomeSchema = zod_1.default.object({
    description: zod_1.default.string().min(5, "Description must be at least 5 characters"),
    unitId: zod_1.default.number().int().positive("Unit ID must be a positive integer"),
    subjectId: zod_1.default.number().int().positive("Subject ID must be a positive integer"),
});
const createCourseOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = courseOutcomeSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { description, unitId, subjectId } = req.body;
        const courseOutcome = yield prisma.courseOutcome.create({
            data: {
                description,
                unitId: parseInt(unitId),
                subjectId: subjectId ? parseInt(subjectId) : null, // Ensure optional field is handled
                attainment: 0, // Default attainment
            },
        });
        return res.status(201).json({
            success: true,
            data: courseOutcome,
        });
    }
    catch (error) {
        console.error("Error in createCourseOutcome controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.createCourseOutcome = createCourseOutcome;
const getCourseOutcomesBySubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId, semesterId } = req.params;
        if (isNaN(Number(subjectId))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Subject ID",
            });
        }
        const whereClause = { subjectId: Number(subjectId) };
        if (semesterId && !isNaN(Number(semesterId))) {
            whereClause.semesterId = Number(semesterId);
        }
        const courseOutcomes = yield prisma.courseOutcome.findMany({
            where: whereClause,
            include: {
                unit: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return res.status(200).json({
            success: true,
            data: courseOutcomes,
        });
    }
    catch (error) {
        console.error("Error in getCourseOutcomesBySubject controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getCourseOutcomesBySubject = getCourseOutcomesBySubject;
const getCourseOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course Outcome ID",
            });
        }
        const courseOutcome = yield prisma.courseOutcome.findUnique({
            where: { id: Number(id) },
            include: {
                unit: true,
                Subject: true,
            },
        });
        if (!courseOutcome) {
            return res.status(404).json({
                success: false,
                message: "Course Outcome not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: courseOutcome,
        });
    }
    catch (error) {
        console.error("Error in getCourseOutcome controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getCourseOutcome = getCourseOutcome;
const updateCourseOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course Outcome ID",
            });
        }
        const result = courseOutcomeSchema.partial().safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const updatedCourseOutcome = yield prisma.courseOutcome.update({
            where: { id: Number(id) },
            data: result.data,
        });
        return res.status(200).json({
            success: true,
            data: updatedCourseOutcome,
        });
    }
    catch (error) {
        console.error("Error in updateCourseOutcome controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateCourseOutcome = updateCourseOutcome;
const deleteCourseOutcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course Outcome ID",
            });
        }
        yield prisma.courseOutcome.delete({
            where: { id: Number(id) },
        });
        return res.status(200).json({
            success: true,
            message: "Course Outcome deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteCourseOutcome controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.deleteCourseOutcome = deleteCourseOutcome;
