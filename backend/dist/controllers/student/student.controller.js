"use strict";
// controllers/studentController.ts
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
exports.getStudentMarksBySemester = exports.getStudentDetails = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const getStudentDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.user.id;
        const student = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrollments: {
                    include: {
                        batch: {
                            include: {
                                course: true,
                            },
                        },
                    },
                },
            },
        });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }
        const enrollment = student.enrollments[0];
        const studentDetails = {
            name: student.name,
            email: student.email,
            rollNo: (enrollment === null || enrollment === void 0 ? void 0 : enrollment.rollNo) || null,
            batchYear: ((_a = enrollment === null || enrollment === void 0 ? void 0 : enrollment.batch) === null || _a === void 0 ? void 0 : _a.batchYear) || null,
            courseName: ((_b = enrollment === null || enrollment === void 0 ? void 0 : enrollment.batch) === null || _b === void 0 ? void 0 : _b.course.courseName) || null,
            profileDetails: student.profileDetails || {},
        };
        return res.status(200).json(studentDetails);
    }
    catch (error) {
        console.error("Error fetching student details:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
exports.getStudentDetails = getStudentDetails;
const getStudentMarksSchema = zod_1.z.object({
    semester: zod_1.z.number().min(1, "Semester must be at least 1").max(12, "Semester can't be more than 12"),
});
const getStudentMarksBySemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const parseResult = getStudentMarksSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.flatten() });
        }
        const { semester } = parseResult.data;
        // Find the student's enrollment first
        const enrollment = yield prisma.enrollment.findFirst({
            where: { studentId: userId, isActive: true },
        });
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found." });
        }
        // Find the subjects for this batch and semester
        const subjects = yield prisma.courseSubject.findMany({
            where: {
                batchId: enrollment.batchId,
                semester: semester,
            },
            include: {
                subject: true,
            },
        });
        if (subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found for this semester." });
        }
        const subjectIds = subjects.map((cs) => cs.subjectId);
        // Fetch Standard Exam Marks with question details
        const standardMarks = yield prisma.standardExamMarks.findMany({
            where: {
                studentId: userId,
                subjectId: { in: subjectIds },
            },
            include: {
                exam: true,
                subject: true,
                questionMarks: {
                    include: {
                        question: {
                            include: {
                                unit: true, // Include unit information
                            },
                        },
                    },
                },
            },
        });
        // Fetch Internal Assessment Marks
        const internalMarks = yield prisma.internalAssessmentMarks.findMany({
            where: {
                studentId: userId,
                subjectId: { in: subjectIds },
            },
            include: {
                exam: true,
                subject: true,
            },
        });
        // Initialize properly typed marksData object
        const marksData = {};
        // Organizing the marks subject-wise
        for (const subject of subjects) {
            const subjectStandardMarks = standardMarks.filter(m => m.subjectId === subject.subjectId);
            const subjectInternalMarks = internalMarks.filter(m => m.subjectId === subject.subjectId);
            marksData[subject.subject.subjectName] = {
                standardExams: subjectStandardMarks.map(m => ({
                    examType: m.exam.examType,
                    totalMarks: m.totalMarks,
                    questionWiseMarks: m.questionMarks.map(qm => ({
                        questionId: qm.question.id,
                        questionText: qm.question.questionText,
                        unitNumber: qm.question.unit.unitNumber,
                        marksAllocated: qm.question.marksAllocated,
                        marksObtained: qm.marksObtained,
                    })),
                })),
                internalAssessments: subjectInternalMarks.map(m => ({
                    examType: m.exam.examType,
                    marksObtained: m.marksObtained,
                })),
            };
        }
        return res.status(200).json(marksData);
    }
    catch (error) {
        console.error("Error fetching marks:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
exports.getStudentMarksBySemester = getStudentMarksBySemester;
