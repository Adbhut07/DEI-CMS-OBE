"use strict";
// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import zod from 'zod';
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
exports.getCOAttainment = exports.calculateCOAttainment = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const coAttainmentSchema = zod_1.default.object({
    batchId: zod_1.default.number().int().positive("Batch ID must be a positive integer"),
    courseId: zod_1.default.number().int().positive("Course ID must be a positive integer"),
});
const calculateCOAttainment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = coAttainmentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { batchId, courseId } = req.body;
        // First, verify the batch and course exist
        const batch = yield prisma.batch.findUnique({
            where: { id: batchId },
        });
        const course = yield prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!batch || !course) {
            return res.status(404).json({
                success: false,
                message: "Batch or Course not found",
            });
        }
        // Get all course subjects for this course and batch
        const courseSubjects = yield prisma.courseSubject.findMany({
            where: {
                courseId: courseId,
                batchId: batchId,
            },
            include: {
                subject: true,
            },
        });
        if (courseSubjects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subjects found for this course and batch",
            });
        }
        const subjectIds = courseSubjects.map(cs => cs.subjectId);
        // Get all units (COs) for all subjects in this course
        const units = yield prisma.unit.findMany({
            where: {
                subjectId: { in: subjectIds },
            },
            include: {
                subject: true,
            },
        });
        if (units.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No units (course outcomes) found for subjects in this course",
            });
        }
        // Get all students enrolled in this batch
        const enrollments = yield prisma.enrollment.findMany({
            where: {
                batchId: batchId,
                isActive: true,
            },
        });
        if (enrollments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active students found in this batch",
            });
        }
        const studentIds = enrollments.map(e => e.studentId);
        const totalStudents = studentIds.length;
        // Process each unit (CO)
        const results = [];
        for (const unit of units) {
            // Get all questions for this unit
            const questions = yield prisma.question.findMany({
                where: {
                    unitId: unit.id,
                },
                include: {
                    exam: true,
                },
            });
            if (questions.length === 0) {
                // Skip units with no questions
                continue;
            }
            const questionIds = questions.map(q => q.id);
            // Get all standard exam marks (with question marks) for these questions
            const standardExamMarks = yield prisma.standardExamMarks.findMany({
                where: {
                    studentId: { in: studentIds },
                    subject: { id: unit.subjectId }
                },
                include: {
                    questionMarks: {
                        where: {
                            questionId: { in: questionIds }
                        },
                        include: {
                            question: true
                        }
                    }
                }
            });
            // Get all internal assessment marks for the subject
            const internalAssessmentMarks = yield prisma.internalAssessmentMarks.findMany({
                where: {
                    studentId: { in: studentIds },
                    subjectId: unit.subjectId
                },
                include: {
                    exam: true
                }
            });
            // Calculate score for each student
            const studentScores = {};
            for (const studentId of studentIds) {
                studentScores[studentId] = { obtained: 0, total: 0 };
                // Calculate standard exam marks (CT1, CT2, CA, ESE)
                const studentStandardMarks = standardExamMarks.filter(mark => mark.studentId === studentId);
                for (const examMark of studentStandardMarks) {
                    for (const questionMark of examMark.questionMarks) {
                        if (questionIds.includes(questionMark.questionId)) {
                            studentScores[studentId].obtained += questionMark.marksObtained;
                            studentScores[studentId].total += questionMark.question.marksAllocated;
                        }
                    }
                }
                // We don't include internal assessment marks in CO attainment calculation
                // as they are not directly tied to specific questions/units
                // If you want to include them, you would need to define a mapping between
                // internal assessments and units
            }
            // Calculate percentages
            const studentPercentages = Object.entries(studentScores).map(([studentId, scores]) => {
                // Only calculate percentage if the student attempted questions (total > 0)
                if (scores.total > 0) {
                    return (scores.obtained / scores.total) * 100;
                }
                return 0; // If student didn't attempt any questions, consider as 0%
            });
            // Count students in each category
            const studentsAbove80 = studentPercentages.filter(p => p >= 80).length;
            const studentsBetween50And80 = studentPercentages.filter(p => p >= 50 && p < 80).length;
            const studentsBetween30And50 = studentPercentages.filter(p => p >= 30 && p < 50).length;
            const studentsBelow30 = studentPercentages.filter(p => p < 30).length;
            // Calculate attainment level based on rubric
            let attainmentLevel = 0;
            if ((studentsAbove80 / totalStudents) * 100 > 50) {
                attainmentLevel = 3;
            }
            else if ((studentsBetween50And80 / totalStudents) * 100 > 50) {
                attainmentLevel = 2;
            }
            else if ((studentsBetween30And50 / totalStudents) * 100 > 50) {
                attainmentLevel = 1;
            }
            // Update unit attainment
            yield prisma.unit.update({
                where: { id: unit.id },
                data: { attainment: attainmentLevel },
            });
            // Create or update CO_Attainment record
            yield prisma.cO_Attainment.upsert({
                where: {
                    coId_batchId_subjectId: {
                        coId: unit.id,
                        batchId: batchId,
                        subjectId: unit.subjectId,
                    },
                },
                update: {
                    attainment: attainmentLevel,
                },
                create: {
                    coId: unit.id,
                    batchId: batchId,
                    subjectId: unit.subjectId,
                    attainment: attainmentLevel,
                },
            });
            // Add to results for response
            results.push({
                unitId: unit.id,
                unitNumber: unit.unitNumber,
                description: unit.description,
                subjectId: unit.subjectId,
                subjectName: unit.subject.subjectName,
                attainmentLevel,
                studentPerformance: {
                    totalStudents,
                    studentsAbove80Percent: studentsAbove80,
                    studentsBetween50And80Percent: studentsBetween50And80,
                    studentsBetween30And50Percent: studentsBetween30And50,
                    studentsBelow30Percent: studentsBelow30,
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "CO attainment calculated successfully",
            courseId,
            batchId,
            courseName: course.courseName,
            results,
        });
    }
    catch (error) {
        console.error("Error calculating CO attainment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.calculateCOAttainment = calculateCOAttainment;
// Get CO attainment for a specific batch and course
const getCOAttainment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { batchId, courseId } = req.params;
        // Get all course subjects for this course and batch
        const courseSubjects = yield prisma.courseSubject.findMany({
            where: {
                courseId: Number(courseId),
                batchId: Number(batchId),
            },
            include: {
                subject: true,
            },
        });
        if (courseSubjects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subjects found for this course and batch",
            });
        }
        const subjectIds = courseSubjects.map(cs => cs.subjectId);
        // Get all CO attainments for this batch and subjects
        const coAttainments = yield prisma.cO_Attainment.findMany({
            where: {
                batchId: Number(batchId),
                subjectId: { in: subjectIds },
            },
            include: {
                co: true,
                subject: true,
            },
            orderBy: [
                { subject: { subjectName: 'asc' } },
                { co: { unitNumber: 'asc' } },
            ],
        });
        return res.status(200).json({
            success: true,
            data: coAttainments,
        });
    }
    catch (error) {
        console.error("Error fetching CO attainment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.getCOAttainment = getCOAttainment;
