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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExam = exports.updateExam = exports.createExam = exports.getExamById = exports.getExamsByCourseAndSemester = exports.getExams = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all exams with course information
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield prisma.exam.findMany({
            include: {
                semester: {
                    include: {
                        course: true,
                    },
                },
                subject: true,
                questions: true,
            },
        });
        res.json(exams);
    }
    catch (error) {
        console.error("Error in getExams controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExams = getExams;
const getExamsByCourseAndSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, semesterId } = req.params;
    try {
        if (!courseId || !semesterId) {
            return res.status(400).json({
                success: false,
                message: "courseId and semesterId are required",
            });
        }
        const exams = yield prisma.exam.findMany({
            where: {
                semester: {
                    id: Number(semesterId),
                    courseId: Number(courseId),
                },
            },
            include: {
                semester: {
                    include: {
                        course: true,
                    },
                },
                subject: true,
                questions: true,
            },
        });
        if (exams.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No exams found for the given course and semester",
            });
        }
        res.json({ success: true, exams });
    }
    catch (error) {
        console.error("Error in getExamsByCourseAndSemester controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExamsByCourseAndSemester = getExamsByCourseAndSemester;
// Get a specific exam by ID with course information
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const exam = yield prisma.exam.findUnique({
            where: { id: Number(id) },
            include: {
                semester: {
                    include: {
                        course: true,
                    },
                },
                subject: true,
                questions: true,
            },
        });
        if (exam) {
            res.json(exam);
        }
        else {
            res.status(404).json({ success: false, message: "Exam not found" });
        }
    }
    catch (error) {
        console.error("Error in getExamById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExamById = getExamById;
// Create an exam with related questions
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { examType, subjectId, semesterId, questions } = req.body;
    try {
        const semester = yield prisma.semester.findUnique({
            where: { id: semesterId },
        });
        const subject = yield prisma.subject.findUnique({
            where: { id: subjectId },
        });
        if (!semester) {
            return res.status(404).json({
                success: false,
                message: "Semester not found.",
            });
        }
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found.",
            });
        }
        for (const q of questions) {
            const unit = yield prisma.unit.findUnique({
                where: {
                    id: q.unitId,
                    subjectId: subjectId
                },
            });
            if (!unit) {
                return res.status(400).json({
                    success: false,
                    message: `Unit with ID ${q.unitId} not found or does not belong to the specified subject.`,
                });
            }
        }
        const existingExam = yield prisma.exam.findFirst({
            where: {
                examType,
                subjectId,
                semesterId,
            },
        });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: "An exam with the same type already exists for this subject and semester.",
            });
        }
        const newExam = yield prisma.exam.create({
            data: {
                examType,
                subjectId,
                semesterId,
                questions: {
                    create: questions.map((q) => ({
                        questionText: q.text,
                        marksAllocated: q.marksAllocated,
                        unitId: q.unitId,
                    })),
                },
            },
            include: {
                semester: {
                    include: {
                        course: true,
                    },
                },
                subject: true,
                questions: true,
            },
        });
        res.status(201).json(newExam);
    }
    catch (error) {
        console.error("Error in createExam controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createExam = createExam;
// Update an exam and related questions
const updateExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { examType, subjectId, semesterId, questions } = req.body;
    try {
        const updatedExam = yield prisma.exam.update({
            where: { id: Number(id) },
            data: {
                examType,
                subject: { connect: { id: subjectId } },
                semester: { connect: { id: semesterId } },
                questions: {
                    deleteMany: {},
                    create: questions.map((q) => ({
                        text: q.text,
                        marks: q.marks,
                    })),
                },
            },
            include: {
                semester: {
                    include: {
                        course: true,
                    },
                },
                subject: true,
                questions: true,
            },
        });
        res.json(updatedExam);
    }
    catch (error) {
        console.error("Error in updateExam controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateExam = updateExam;
// Delete an exam and related questions
const deleteExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const examId = Number(id);
        // Delete related marks
        yield prisma.marks.deleteMany({
            where: { examId },
        });
        // Delete related questions
        yield prisma.question.deleteMany({
            where: { examId },
        });
        // Delete the exam
        yield prisma.exam.delete({
            where: { id: examId },
        });
        res.status(200).json({ success: true, message: "Exam deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteExam controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteExam = deleteExam;
