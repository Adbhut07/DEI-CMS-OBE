"use strict";
// controllers/semesterController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentStudentSemesters = exports.getActiveSemesters = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Schema for validating the request body
const getActiveSemestersSchema = zod_1.z.object({
    batchId: zod_1.z.number().positive("Batch ID must be a positive number"),
});
/**
 * Fetches the list of active semesters for a specific batch
 * This can be used to populate dropdown menus for semester selection
 */
const getActiveSemesters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const parseResult = getActiveSemestersSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.flatten() });
        }
        const { batchId } = parseResult.data;
        // Check if the batch exists
        const batch = yield prisma.batch.findUnique({
            where: { id: batchId },
            include: {
                course: true,
            },
        });
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        // For student users, check if they're enrolled in this batch
        if (req.user.role === "Student") {
            const enrollment = yield prisma.enrollment.findFirst({
                where: {
                    studentId: req.user.id,
                    batchId: batchId,
                    isActive: true,
                },
            });
            if (!enrollment) {
                return res.status(403).json({ message: "You are not enrolled in this batch" });
            }
        }
        // Get distinct semesters from CourseSubject for this batch
        const courseSubjects = yield prisma.courseSubject.findMany({
            where: {
                batchId: batchId,
            },
            select: {
                semester: true,
            },
            distinct: ['semester'],
            orderBy: {
                semester: 'asc',
            },
        });
        // Extract and format the semester information
        const activeSemesters = courseSubjects.map(cs => ({
            semester: cs.semester,
        }));
        // Return the list of active semesters along with batch and course information
        return res.status(200).json({
            batchYear: batch.batchYear,
            courseName: batch.course.courseName,
            activeSemesters: activeSemesters,
        });
    }
    catch (error) {
        console.error("Error fetching active semesters:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getActiveSemesters = getActiveSemesters;
/**
 * Fetches the list of active semesters for the current student's batch
 * This is a convenience endpoint for students to easily get their semesters
 */
const getCurrentStudentSemesters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Only allow students to access this endpoint
        if (req.user.role !== "Student") {
            return res.status(403).json({ message: "This endpoint is only for students" });
        }
        const userId = req.user.id;
        // Find the student's active enrollment
        const enrollment = yield prisma.enrollment.findFirst({
            where: {
                studentId: userId,
                isActive: true,
            },
            include: {
                batch: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        if (!enrollment) {
            return res.status(404).json({ message: "No active enrollment found" });
        }
        // Get distinct semesters from CourseSubject for this batch
        const courseSubjects = yield prisma.courseSubject.findMany({
            where: {
                batchId: enrollment.batchId,
            },
            select: {
                semester: true,
            },
            distinct: ['semester'],
            orderBy: {
                semester: 'asc',
            },
        });
        // Extract and format the semester information
        const activeSemesters = courseSubjects.map(cs => ({
            semester: cs.semester,
        }));
        // Return the list of active semesters along with batch and course information
        return res.status(200).json({
            batchId: enrollment.batchId,
            batchYear: enrollment.batch.batchYear,
            courseName: enrollment.batch.course.courseName,
            activeSemesters: activeSemesters,
        });
    }
    catch (error) {
        console.error("Error fetching student semesters:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCurrentStudentSemesters = getCurrentStudentSemesters;
