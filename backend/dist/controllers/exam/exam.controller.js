"use strict";
// import { Request, Response } from 'express';
// import { PrismaClient, ExamType } from '@prisma/client';
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
exports.deleteExam = exports.updateExam = exports.createExam = exports.getExamById = exports.getOnlyExamsBySubject = exports.getExamsBySubject = exports.getExams = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const EXAM_TYPES_WITH_QUESTIONS = [
    client_1.ExamType.CT1,
    client_1.ExamType.CT2,
    client_1.ExamType.CA,
    client_1.ExamType.ESE
];
const INTERNAL_ASSESSMENT_TYPES = [
    client_1.ExamType.DHA,
    client_1.ExamType.AA,
    client_1.ExamType.ATT
];
// Exam type-specific marks allocation
const EXAM_MARKS_ALLOCATION = {
    CT1: 40,
    CT2: 40,
    CA: 40,
    ESE: 50,
    DHA: 40,
    AA: 20,
    ATT: 10, // or 20 (based on subject, can be dynamic)
};
const createExamSchema = zod_1.default.object({
    examType: zod_1.default.nativeEnum(client_1.ExamType),
    subjectId: zod_1.default.number().int().positive(),
    marksAllocated: zod_1.default.number().positive(),
    questions: zod_1.default.array(zod_1.default.object({
        text: zod_1.default.string(),
        marksAllocated: zod_1.default.number().positive(),
        unitId: zod_1.default.number().int().positive(),
    })).optional(),
});
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield prisma.exam.findMany({
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            include: {
                                course: true,
                                batch: true,
                            },
                        },
                    },
                },
                questions: {
                    include: {
                        unit: true,
                    },
                },
            },
        });
        // Filter out questions for internal assessment exams (DHA, AA, ATT)
        const filteredExams = exams.map(exam => (Object.assign(Object.assign({}, exam), { questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions })));
        res.json({ success: true, data: filteredExams });
    }
    catch (error) {
        console.error("Error in getExams controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExams = getExams;
const getExamsBySubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subjectId } = req.params;
    try {
        const subject = yield prisma.subject.findUnique({
            where: { id: Number(subjectId) }
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }
        const exams = yield prisma.exam.findMany({
            where: {
                subjectId: Number(subjectId),
            },
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            include: {
                                course: true,
                                batch: true
                            }
                        }
                    }
                },
                questions: {
                    include: {
                        unit: true,
                    }
                },
                standardMarks: true,
                internalMarks: true
            },
        });
        // Filter out questions for internal assessment exams (DHA, AA, ATT)
        const filteredExams = exams.map(exam => (Object.assign(Object.assign({}, exam), { questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions })));
        return res.json({
            success: true,
            data: filteredExams,
            message: exams.length === 0 ? "No exams found for this subject" : undefined
        });
    }
    catch (error) {
        console.error("Error in getExamsBySubject controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExamsBySubject = getExamsBySubject;
const getOnlyExamsBySubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subjectId } = req.params;
    try {
        const subject = yield prisma.subject.findUnique({
            where: { id: Number(subjectId) }
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }
        const exams = yield prisma.exam.findMany({
            where: {
                subjectId: Number(subjectId),
            },
            include: {
                questions: true,
            },
        });
        // Remove questions for internal assessment exams (DHA, AA, ATT)
        const filteredExams = exams.map(exam => (Object.assign(Object.assign({}, exam), { questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions })));
        return res.json({
            success: true,
            data: filteredExams,
            message: filteredExams.length === 0 ? "No exams found for this subject" : undefined
        });
    }
    catch (error) {
        console.error("Error in getOnlyExamsBySubject controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getOnlyExamsBySubject = getOnlyExamsBySubject;
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const exam = yield prisma.exam.findUnique({
            where: { id: Number(id) },
            include: {
                subject: {
                    include: {
                        courseMappings: {
                            include: {
                                course: true,
                                batch: true
                            }
                        }
                    }
                },
                questions: {
                    include: {
                        unit: true,
                        marks: true
                    }
                },
                standardMarks: {
                    include: {
                        questionMarks: true
                    }
                },
                internalMarks: true
            },
        });
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }
        // Remove questions for internal assessment exams (DHA, AA, ATT)
        const filteredExam = Object.assign(Object.assign({}, exam), { questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions });
        return res.json({ success: true, data: filteredExam });
    }
    catch (error) {
        console.error("Error in getExamById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExamById = getExamById;
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { examType, subjectId, marksAllocated, questions } = req.body;
    try {
        const validationResult = createExamSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data",
                errors: validationResult.error.errors
            });
        }
        const subject = yield prisma.subject.findUnique({
            where: { id: subjectId },
            include: {
                courseMappings: true,
                units: { orderBy: { unitNumber: 'asc' } }
            },
        });
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found." });
        }
        if (subject.courseMappings.length === 0) {
            return res.status(400).json({ success: false, message: "Subject is not mapped to any course." });
        }
        if (subject.units.length === 0) {
            return res.status(400).json({ success: false, message: "Subject has no units defined." });
        }
        const existingExam = yield prisma.exam.findFirst({
            where: { examType, subjectId },
        });
        if (existingExam) {
            return res.status(400).json({ success: false, message: "An exam with this type already exists for this subject." });
        }
        // Validate marks allocation based on exam type
        if (marksAllocated !== EXAM_MARKS_ALLOCATION[examType]) {
            return res.status(400).json({
                success: false,
                message: `Invalid marks allocation for ${examType}. Expected: ${EXAM_MARKS_ALLOCATION[examType]}`,
            });
        }
        let newExam;
        if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
            // CT1, CT2, CA, ESE exams require questions
            if (!questions || !Array.isArray(questions)) {
                return res.status(400).json({
                    success: false,
                    message: "Questions are required for this exam type.",
                });
            }
            for (const q of questions) {
                const unit = subject.units.find(u => u.id === q.unitId);
                if (!unit) {
                    return res.status(400).json({
                        success: false,
                        message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
                    });
                }
            }
            newExam = yield prisma.exam.create({
                data: {
                    examType,
                    subjectId,
                    marksAllocated,
                    questions: {
                        create: questions.map(q => ({
                            questionText: q.text,
                            marksAllocated: q.marksAllocated,
                            unitId: q.unitId,
                        }))
                    },
                },
                include: { questions: true }
            });
        }
        else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
            // DHA, AA, ATT exams do NOT require questions
            newExam = yield prisma.exam.create({
                data: {
                    examType,
                    subjectId,
                    marksAllocated,
                }
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid exam type",
            });
        }
        res.status(201).json({
            success: true,
            message: "Exam created successfully.",
            data: newExam,
        });
    }
    catch (error) {
        console.error("Error in createExam controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createExam = createExam;
const updateExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { examType, subjectId, marksAllocated, questions } = req.body;
    try {
        const existingExam = yield prisma.exam.findUnique({
            where: { id: Number(id) },
            include: {
                questions: true,
                subject: {
                    include: {
                        units: {
                            orderBy: {
                                unitNumber: 'asc'
                            }
                        }
                    }
                },
                standardMarks: {
                    include: {
                        questionMarks: true
                    }
                },
                internalMarks: true
            }
        });
        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }
        // If changing exam type between regular and internal, ensure it's allowed
        const wasRegular = EXAM_TYPES_WITH_QUESTIONS.includes(existingExam.examType);
        const willBeRegular = EXAM_TYPES_WITH_QUESTIONS.includes(examType);
        if (wasRegular !== willBeRegular) {
            return res.status(400).json({
                success: false,
                message: "Cannot change between regular and internal assessment exam types"
            });
        }
        let questionsToUpdate = {}; // Default empty object
        if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
            // Regular exams (CT1, CT2, CA, ESE) → Update or Create Questions
            const existingQuestions = questions.filter((q) => q.id);
            const newQuestions = questions.filter((q) => !q.id);
            // Validate units
            for (const q of [...existingQuestions, ...newQuestions]) {
                const unit = existingExam.subject.units.find(u => u.id === q.unitId);
                if (!unit) {
                    return res.status(400).json({
                        success: false,
                        message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
                    });
                }
            }
            questionsToUpdate = {
                deleteMany: {}, // Remove any existing questions if not part of the updated ones
                create: newQuestions.map((q) => ({
                    questionText: q.text,
                    marksAllocated: q.marksAllocated,
                    unitId: q.unitId,
                })),
                update: existingQuestions.map((q) => ({
                    where: { id: q.id },
                    data: {
                        questionText: q.text,
                        marksAllocated: q.marksAllocated,
                        unitId: q.unitId,
                    }
                }))
            };
        }
        else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
            // Internal assessments (DHA, AA, ATT) → REMOVE QUESTIONS
            questionsToUpdate = {
                deleteMany: {} // Deletes all questions for internal assessments
            };
        }
        const updatedExam = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete related marks if they exist
            if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
                // For standard exams, delete standardExamMarks and associated questionMarks
                // QuestionMarks will be automatically deleted due to onDelete: Cascade
                yield tx.standardExamMarks.deleteMany({
                    where: { examId: Number(id) }
                });
            }
            else {
                // For internal assessment exams, delete internalAssessmentMarks
                yield tx.internalAssessmentMarks.deleteMany({
                    where: { examId: Number(id) }
                });
            }
            return tx.exam.update({
                where: { id: Number(id) },
                data: {
                    examType,
                    subjectId,
                    marksAllocated,
                    questions: questionsToUpdate // Handles different logic for regular/internal
                },
                include: {
                    subject: {
                        include: {
                            courseMappings: {
                                include: {
                                    course: true,
                                    batch: true
                                }
                            }
                        }
                    },
                    questions: {
                        include: {
                            unit: true
                        }
                    },
                },
            });
        }));
        res.json({
            success: true,
            message: "Exam updated successfully.",
            data: updatedExam
        });
    }
    catch (error) {
        console.error("Error in updateExam controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateExam = updateExam;
const deleteExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const examId = Number(id);
        const existingExam = yield prisma.exam.findUnique({
            where: { id: examId },
            include: {
                questions: true,
                standardMarks: {
                    include: {
                        questionMarks: true
                    }
                },
                internalMarks: true
            }
        });
        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found.",
            });
        }
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete related marks based on exam type
            if (EXAM_TYPES_WITH_QUESTIONS.includes(existingExam.examType)) {
                // For standard exams with questions (CT1, CT2, CA, ESE)
                // QuestionMarks will be automatically deleted due to onDelete: Cascade
                if (existingExam.standardMarks.length > 0) {
                    yield tx.standardExamMarks.deleteMany({ where: { examId } });
                }
            }
            else {
                // For internal assessment exams (DHA, AA, ATT)
                if (existingExam.internalMarks.length > 0) {
                    yield tx.internalAssessmentMarks.deleteMany({ where: { examId } });
                }
            }
            // Delete related questions only for exams that use them (CT1, CT2, CA, ESE)
            if (existingExam.questions.length > 0) {
                yield tx.question.deleteMany({ where: { examId } });
            }
            // Delete the exam itself
            yield tx.exam.delete({ where: { id: examId } });
        }));
        res.status(200).json({ success: true, message: "Exam deleted successfully." });
    }
    catch (error) {
        console.error("Error in deleteExam controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Unable to delete exam."
        });
    }
});
exports.deleteExam = deleteExam;
