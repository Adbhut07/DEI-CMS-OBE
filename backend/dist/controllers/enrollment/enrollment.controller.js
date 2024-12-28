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
exports.getEnrollmentsByCourseId = exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getAllEnrollments = exports.createEnrollment = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const enrollmentSchema = zod_1.default.object({
    studentId: zod_1.default.number().int().positive("Student ID must be a positive integer"),
    courseId: zod_1.default.number().int().positive("Course ID must be a positive integer"),
    semesterId: zod_1.default.number().int().positive("Semester ID must be a positive integer"),
});
const createEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = enrollmentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { studentId, courseId, semesterId } = req.body;
        const enrollment = yield prisma.enrollment.create({
            data: {
                studentId,
                courseId,
                semesterId,
            },
        });
        return res.status(201).json({
            success: true,
            data: enrollment,
        });
    }
    catch (error) {
        console.error("Error creating enrollment:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.createEnrollment = createEnrollment;
const getAllEnrollments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollments = yield prisma.enrollment.findMany({
            include: {
                student: true,
                course: true,
                semester: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: enrollments,
        });
    }
    catch (error) {
        console.error("Error fetching enrollments:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getAllEnrollments = getAllEnrollments;
// Get Enrollment by ID
const getEnrollmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const enrollment = yield prisma.enrollment.findUnique({
            where: { id: parseInt(id) },
            include: {
                student: true,
                course: true,
                semester: true,
            },
        });
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: enrollment,
        });
    }
    catch (error) {
        console.error("Error fetching enrollment by ID:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getEnrollmentById = getEnrollmentById;
// Update Enrollment
const updateEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = enrollmentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { studentId, courseId, semesterId } = req.body;
        const updatedEnrollment = yield prisma.enrollment.update({
            where: { id: parseInt(id) },
            data: {
                studentId,
                courseId,
                semesterId,
            },
        });
        return res.status(200).json({
            success: true,
            data: updatedEnrollment,
        });
    }
    catch (error) {
        console.error("Error updating enrollment:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateEnrollment = updateEnrollment;
// Delete Enrollment
const deleteEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.enrollment.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting enrollment:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.deleteEnrollment = deleteEnrollment;
const getEnrollmentsByCourseId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { semesterId } = req.query;
        const filter = { courseId: parseInt(courseId) };
        if (semesterId) {
            filter.semesterId = parseInt(semesterId);
        }
        const enrollments = yield prisma.enrollment.findMany({
            where: filter,
            include: {
                student: true,
                course: true,
                semester: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: enrollments,
        });
    }
    catch (error) {
        console.error("Error fetching enrollments by course ID:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getEnrollmentsByCourseId = getEnrollmentsByCourseId;
