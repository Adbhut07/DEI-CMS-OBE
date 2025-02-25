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
exports.getSubjectsWithUnitsByCourse = exports.getSubjectsByCourse = exports.assignFacultyToSubject = exports.mapCourseToSubject = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const courseSubjectSchema = zod_1.default.object({
    courseId: zod_1.default.number().int().positive("Course ID must be a positive integer"),
    subjectId: zod_1.default.number().int().positive("Subject ID must be a positive integer"),
    semester: zod_1.default.number().int().min(1).max(8, "Semester must be between 1 and 8"),
    batchId: zod_1.default.number().int().positive("Batch ID must be a positive integer"),
});
const mapCourseToSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = courseSubjectSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { courseId, subjectId, semester, batchId } = req.body;
        const mapping = yield prisma.courseSubject.create({
            data: { courseId, subjectId, semester, batchId },
        });
        return res.status(201).json({
            success: true,
            message: "Subject mapped to course successfully",
            data: mapping,
        });
    }
    catch (error) {
        console.error("Error mapping subject to course:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.mapCourseToSubject = mapCourseToSubject;
const assignFacultyToSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseSubjectId, facultyId } = req.body;
        if (!courseSubjectId || !facultyId) {
            return res.status(400).json({ success: false, message: "CourseSubject ID and Faculty ID are required" });
        }
        const updatedMapping = yield prisma.courseSubject.update({
            where: { id: courseSubjectId },
            data: { facultyId },
        });
        return res.status(200).json({
            success: true,
            message: "Faculty assigned to subject successfully",
            data: updatedMapping,
        });
    }
    catch (error) {
        console.error("Error assigning faculty to subject:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.assignFacultyToSubject = assignFacultyToSubject;
const getSubjectsByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }
        const subjects = yield prisma.courseSubject.findMany({
            where: { courseId },
            include: {
                subject: true,
                faculty: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            },
        });
        return res.status(200).json({ success: true, data: subjects });
    }
    catch (error) {
        console.error("Error fetching subjects by course ID:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSubjectsByCourse = getSubjectsByCourse;
const getSubjectsWithUnitsByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }
        const subjects = yield prisma.courseSubject.findMany({
            where: { courseId },
            include: {
                subject: {
                    include: {
                        units: true, // Includes all units of the subject
                    }
                },
                faculty: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            },
        });
        return res.status(200).json({ success: true, data: subjects });
    }
    catch (error) {
        console.error("Error fetching subjects with units by course ID:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSubjectsWithUnitsByCourse = getSubjectsWithUnitsByCourse;
