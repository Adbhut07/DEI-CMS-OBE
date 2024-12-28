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
exports.deleteSubject = exports.updateSubject = exports.getSubject = exports.getSubjects = exports.assignFacultyToSubject = exports.createSubject = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const subjectSchema = zod_1.default.object({
    subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters"),
    semesterId: zod_1.default.number().int("Invalid semester ID"),
});
const updateSubjectSchema = zod_1.default.object({
    subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters").optional(),
    semesterId: zod_1.default.number().int("Invalid semester ID").optional(),
    facultyId: zod_1.default.number().int("Invalid faculty ID").optional(),
});
const assignFacultySchema = zod_1.default.object({
    facultyId: zod_1.default.number().int("Invalid faculty ID"),
});
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = subjectSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { subjectName, semesterId } = result.data;
        const semesterExists = yield prisma.semester.findUnique({
            where: { id: semesterId },
        });
        if (!semesterExists) {
            return res.status(404).json({
                success: false,
                message: "Semester not found",
            });
        }
        const subject = yield prisma.subject.create({
            data: {
                subjectName,
                semesterId,
            },
        });
        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: subject,
        });
    }
    catch (error) {
        console.error("Error in createSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.createSubject = createSubject;
const assignFacultyToSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId } = req.params;
        const result = assignFacultySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { facultyId } = result.data;
        const subjectExists = yield prisma.subject.findUnique({
            where: { id: parseInt(subjectId) },
        });
        if (!subjectExists) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        const faculty = yield prisma.user.findUnique({
            where: { id: facultyId },
        });
        if (!faculty || faculty.role !== "Faculty") {
            return res.status(403).json({
                success: false,
                message: "Invalid or unauthorized faculty ID",
            });
        }
        const updatedSubject = yield prisma.subject.update({
            where: { id: parseInt(subjectId) },
            data: { facultyId },
        });
        res.status(200).json({
            success: true,
            message: "Faculty assigned to subject successfully",
            data: updatedSubject,
        });
    }
    catch (error) {
        console.error("Error in assignFacultyToSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.assignFacultyToSubject = assignFacultyToSubject;
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { semesterId } = req.query;
        const whereClause = semesterId
            ? { semesterId: Number(semesterId) }
            : {};
        const subjects = yield prisma.subject.findMany({
            where: whereClause,
            include: { semester: true, faculty: true, units: true },
        });
        res.status(200).json({
            success: true,
            data: subjects,
        });
    }
    catch (error) {
        console.error("Error in getSubjects:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getSubjects = getSubjects;
const getSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const subject = yield prisma.subject.findUnique({
            where: { id },
            include: { semester: true, faculty: true, units: true },
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        res.status(200).json({
            success: true,
            data: subject,
        });
    }
    catch (error) {
        console.error("Error in getSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getSubject = getSubject;
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = updateSubjectSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { facultyId } = result.data;
        const subjectExists = yield prisma.subject.findUnique({ where: { id } });
        if (!subjectExists) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        if (facultyId !== undefined) {
            const faculty = yield prisma.user.findUnique({
                where: { id: facultyId },
            });
            if (!faculty || faculty.role !== "Faculty") {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or unauthorized faculty ID",
                });
            }
        }
        const subject = yield prisma.subject.update({
            where: { id },
            data: result.data,
        });
        res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            data: subject,
        });
    }
    catch (error) {
        console.error("Error in updateSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const subjectExists = yield prisma.subject.findUnique({ where: { id } });
        if (!subjectExists) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        yield prisma.subject.delete({ where: { id } });
        res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.deleteSubject = deleteSubject;
