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
exports.deleteExam = exports.updateExam = exports.createExam = exports.getExamById = exports.getExamsBySubject = exports.getExams = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const EXAM_TYPES_WITH_QUESTIONS = [
    client_1.ExamType.CT1,
    client_1.ExamType.CT2,
    client_1.ExamType.ESE
];
const INTERNAL_ASSESSMENT_TYPES = [
    client_1.ExamType.DHA,
    client_1.ExamType.CA,
    client_1.ExamType.AA,
    client_1.ExamType.ATT
];
const regularQuestionSchema = zod_1.default.array(zod_1.default.object({
    text: zod_1.default.string(),
    marksAllocated: zod_1.default.number().positive(),
    unitId: zod_1.default.number().int().positive(),
}));
// Schema for internal assessment exams
const internalAssessmentSchema = zod_1.default.object({
    totalMarks: zod_1.default.number().positive()
});
const createExamSchema = zod_1.default.object({
    examType: zod_1.default.nativeEnum(client_1.ExamType),
    subjectId: zod_1.default.number().int().positive(),
    questions: zod_1.default.union([regularQuestionSchema, internalAssessmentSchema])
});
// Get all exams with course information
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield prisma.exam.findMany({
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
            },
        });
        res.json({ success: true, data: exams });
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
                        marks: true
                    }
                },
                marks: true
            },
        });
        return res.json({
            success: true,
            data: exams,
            message: exams.length === 0 ? "No exams found for this subject" : undefined
        });
    }
    catch (error) {
        console.error("Error in getExamsBySubject controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExamsBySubject = getExamsBySubject;
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
            },
        });
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }
        return res.json({ success: true, data: exam });
    }
    catch (error) {
        console.error("Error in getExamById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExamById = getExamById;
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { examType, subjectId, questions } = req.body;
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
                units: {
                    orderBy: {
                        unitNumber: 'asc'
                    }
                }
            },
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found.",
            });
        }
        if (subject.courseMappings.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Subject is not mapped to any course.",
            });
        }
        if (subject.units.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Subject has no units defined.",
            });
        }
        const existingExam = yield prisma.exam.findFirst({
            where: { examType, subjectId },
        });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: "An exam with this type already exists for this subject.",
            });
        }
        let questionsToCreate;
        if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
            // For CT1, CT2, ESE - validate and use regular questions
            for (const q of questions) {
                const unit = subject.units.find(u => u.id === q.unitId);
                if (!unit) {
                    return res.status(400).json({
                        success: false,
                        message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
                    });
                }
            }
            questionsToCreate = questions.map((q) => ({
                questionText: q.text,
                marksAllocated: q.marksAllocated,
                unitId: q.unitId,
            }));
        }
        else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
            // For internal assessments - create equal distribution across units
            const totalMarks = questions.totalMarks;
            const numUnits = subject.units.length;
            const marksPerUnit = Math.floor(totalMarks / numUnits);
            const remainingMarks = totalMarks % numUnits;
            questionsToCreate = subject.units.map((unit, index) => ({
                questionText: `${examType} assessment for Unit ${unit.unitNumber}`,
                // Add extra mark to first few units if there are remaining marks
                marksAllocated: marksPerUnit + (index < remainingMarks ? 1 : 0),
                unitId: unit.id,
            }));
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid exam type",
            });
        }
        const newExam = yield prisma.exam.create({
            data: {
                examType,
                subjectId,
                questions: {
                    create: questionsToCreate,
                },
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
    const { examType, subjectId, questions } = req.body;
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
                }
            }
        });
        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }
        // If exam type is changing between regular and internal, verify it's allowed
        if (existingExam.examType !== examType) {
            const wasRegular = EXAM_TYPES_WITH_QUESTIONS.includes(existingExam.examType);
            const willBeRegular = EXAM_TYPES_WITH_QUESTIONS.includes(examType);
            if (wasRegular !== willBeRegular) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot change between regular and internal assessment exam types"
                });
            }
        }
        let questionsToUpdate; //will change later
        if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
            // Handle regular questions update
            const existingQuestions = questions.filter((q) => q.id);
            const newQuestions = questions.filter((q) => !q.id);
            // Validate all units belong to subject
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
                update: existingQuestions.map((q) => ({
                    where: { id: q.id },
                    data: {
                        questionText: q.text,
                        marksAllocated: q.marksAllocated,
                        unitId: q.unitId,
                    }
                })),
                create: newQuestions.map((q) => ({
                    questionText: q.text,
                    marksAllocated: q.marksAllocated,
                    unitId: q.unitId,
                }))
            };
        }
        else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
            // Update internal assessment marks distribution
            const totalMarks = questions.totalMarks;
            const numUnits = existingExam.subject.units.length;
            const marksPerUnit = Math.floor(totalMarks / numUnits);
            const remainingMarks = totalMarks % numUnits;
            // Create update operations for existing questions or create new ones if needed
            questionsToUpdate = {
                deleteMany: {
                    examId: Number(id)
                },
                create: existingExam.subject.units.map((unit, index) => ({
                    questionText: `${examType} assessment for Unit ${unit.unitNumber}`,
                    marksAllocated: marksPerUnit + (index < remainingMarks ? 1 : 0),
                    unitId: unit.id,
                }))
            };
        }
        const updatedExam = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete related marks if they exist
            yield tx.marks.deleteMany({
                where: { examId: Number(id) }
            });
            return tx.exam.update({
                where: { id: Number(id) },
                data: {
                    examType,
                    subjectId,
                    questions: questionsToUpdate
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
            data: updatedExam
        });
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
        const existingExam = yield prisma.exam.findUnique({
            where: { id: examId },
        });
        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found.",
            });
        }
        yield prisma.$transaction([
            prisma.marks.deleteMany({
                where: { examId },
            }),
            prisma.question.deleteMany({
                where: { examId },
            }),
            prisma.exam.delete({
                where: { id: examId },
            }),
        ]);
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
