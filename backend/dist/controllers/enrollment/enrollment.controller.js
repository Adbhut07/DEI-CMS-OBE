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
exports.updateEnrollmentStatus = exports.removeEnrollment = exports.getStudentEnrollment = exports.getEnrollmentsByBatch = exports.getEnrollmentsByCourseAndBatch = exports.createEnrollment = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const enrollmentSchema = zod_1.default.object({
    studentId: zod_1.default.number().int().positive("Student ID must be a positive integer"),
    batchId: zod_1.default.number().int().positive("Batch ID must be a positive integer"),
    rollNo: zod_1.default.string().min(1, "Roll number is required")
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
        const { studentId, batchId, rollNo } = req.body;
        const existingEnrollment = yield prisma.enrollment.findFirst({
            where: { studentId, batchId },
        });
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled in this batch",
            });
        }
        const rollNoExists = yield prisma.enrollment.findFirst({
            where: { batchId, rollNo },
        });
        if (rollNoExists) {
            return res.status(400).json({
                success: false,
                message: "This roll number is already assigned in this batch",
            });
        }
        // Create Enrollment
        const enrollment = yield prisma.enrollment.create({
            data: { studentId, batchId, rollNo },
        });
        return res.status(201).json({
            success: true,
            message: "Student enrolled successfully",
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
// ✅ Get All Enrolled Students in a Course by Batch
const getEnrollmentsByCourseAndBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Batch ID",
            });
        }
        // Find batch and get courseId
        const batch = yield prisma.batch.findUnique({
            where: { id: batchId },
            include: { course: true },
        });
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found",
            });
        }
        // Fetch enrolled students in the batch
        const enrollments = yield prisma.enrollment.findMany({
            where: { batchId },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: `Students enrolled in course ${batch.course.courseName}, Batch ${batch.batchYear}`,
            courseId: batch.course.id,
            courseName: batch.course.courseName,
            batchYear: batch.batchYear,
            students: enrollments.map((enrollment) => (Object.assign(Object.assign({}, enrollment.student), { rollNo: enrollment.rollNo }))),
        });
    }
    catch (error) {
        console.error("Error fetching enrollments by course and batch:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getEnrollmentsByCourseAndBatch = getEnrollmentsByCourseAndBatch;
// ✅ Get All Enrolled Students in a Batch
const getEnrollmentsByBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Batch ID",
            });
        }
        const enrollments = yield prisma.enrollment.findMany({
            where: { batchId },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return res.status(200).json({
            success: true,
            data: enrollments.map((enrollment) => (Object.assign(Object.assign({}, enrollment), { student: Object.assign(Object.assign({}, enrollment.student), { rollNo: enrollment.rollNo }) }))),
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
exports.getEnrollmentsByBatch = getEnrollmentsByBatch;
// ✅ Get Student's Enrollment Details
const getStudentEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = parseInt(req.params.studentId);
        if (isNaN(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Student ID",
            });
        }
        const enrollment = yield prisma.enrollment.findMany({
            where: { studentId },
            include: {
                batch: {
                    select: { id: true, batchYear: true },
                },
            },
        });
        return res.status(200).json({
            success: true,
            data: enrollment.map((e) => (Object.assign(Object.assign({}, e), { rollNo: e.rollNo }))),
        });
    }
    catch (error) {
        console.error("Error fetching student's enrollment:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getStudentEnrollment = getStudentEnrollment;
// ✅ Remove Student from Batch (Dropout)
const removeEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollmentId = parseInt(req.params.enrollmentId);
        if (isNaN(enrollmentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Enrollment ID",
            });
        }
        // Soft Delete: Set isActive to false
        yield prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { isActive: false },
        });
        return res.status(200).json({
            success: true,
            message: "Enrollment removed successfully",
        });
    }
    catch (error) {
        console.error("Error removing enrollment:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.removeEnrollment = removeEnrollment;
const updateEnrollmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollmentId = parseInt(req.params.enrollmentId);
        const isActive = req.body.isActive;
        if (isNaN(enrollmentId) || typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
            });
        }
        yield prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { isActive },
        });
        return res.status(200).json({
            success: true,
            message: "Enrollment status updated successfully",
        });
    }
    catch (error) {
        console.error("Error updating enrollment status:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateEnrollmentStatus = updateEnrollmentStatus;
