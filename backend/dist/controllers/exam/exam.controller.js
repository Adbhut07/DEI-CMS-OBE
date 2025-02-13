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
const createExamSchema = zod_1.default.object({
    examType: zod_1.default.nativeEnum(client_1.ExamType),
    subjectId: zod_1.default.number().int().positive(),
    questions: zod_1.default.array(zod_1.default.object({
        text: zod_1.default.string(),
        marksAllocated: zod_1.default.number().positive(),
        unitId: zod_1.default.number().int().positive(),
    })),
});
const updateExamSchema = zod_1.default.object({
    examType: zod_1.default.nativeEnum(client_1.ExamType),
    subjectId: zod_1.default.number().int().positive(),
    questions: zod_1.default.array(zod_1.default.object({
        id: zod_1.default.number().optional(),
        text: zod_1.default.string(),
        marksAllocated: zod_1.default.number().positive(),
        unitId: zod_1.default.number().int().positive(),
    })),
});
// Get all exams with course information
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield prisma.exam.findMany({
            include: {
                subject: {
                    include: {
                        semester: {
                            include: {
                                course: true
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
                        semester: {
                            include: {
                                course: true
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
// export const getExamsByCourseAndSemester = async (req: Request, res: Response): Promise<any> => {
//   const { courseId, semesterId } = req.params;
//   try {
//     if (!courseId || !semesterId) {
//       return res.status(400).json({
//         success: false,
//         message: "courseId and semesterId are required",
//       });
//     }
//     const exams = await prisma.exam.findMany({
//       where: {
//         semester: {
//           id: Number(semesterId),
//           courseId: Number(courseId),
//         },
//       },
//       include: {
//         semester: {
//           include: {
//             course: true,
//           },
//         },
//         subject: true, 
//         questions: true, 
//       },
//     });
//     if (exams.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No exams found for the given course and semester",
//       });
//     }
//     res.json({ success: true, exams });
//   } catch (error) {
//     console.error("Error in getExamsByCourseAndSemester controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
// Get a specific exam by ID with course information
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const exam = yield prisma.exam.findUnique({
            where: { id: Number(id) },
            include: {
                subject: {
                    include: {
                        semester: {
                            include: {
                                course: true
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
        const subject = yield prisma.subject.findUnique({
            where: { id: subjectId },
            include: { semester: true },
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found.",
            });
        }
        const { semesterId } = subject;
        const semester = yield prisma.semester.findUnique({
            where: { id: semesterId },
        });
        if (!semester) {
            return res.status(404).json({
                success: false,
                message: "Semester not found.",
            });
        }
        const existingExam = yield prisma.exam.findFirst({
            where: {
                examType,
                subjectId,
            },
        });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: "An exam with this type already exists for this subject.",
            });
        }
        for (const q of questions) {
            const unit = yield prisma.unit.findFirst({
                where: { id: q.unitId, subjectId },
            });
            if (!unit) {
                return res.status(400).json({
                    success: false,
                    message: `Unit with ID ${q.unitId} not found or does not belong to the specified subject.`,
                });
            }
        }
        const newExam = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const createdExam = yield tx.exam.create({
                data: {
                    examType,
                    subjectId,
                    questions: {
                        create: questions.map((q) => ({
                            questionText: q.text,
                            marksAllocated: q.marksAllocated,
                            unitId: q.unitId,
                        })),
                    },
                },
                include: {
                    subject: true,
                    questions: true,
                },
            });
            return createdExam;
        }));
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
            include: { questions: true }
        });
        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }
        const subject = yield prisma.subject.findUnique({
            where: { id: subjectId },
            include: { semester: true }
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found.",
            });
        }
        for (const q of questions) {
            if (!q.id) {
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
        }
        const duplicateExam = yield prisma.exam.findFirst({
            where: {
                examType,
                subjectId,
                NOT: {
                    id: Number(id)
                }
            },
        });
        if (duplicateExam) {
            return res.status(400).json({
                success: false,
                message: "An exam with the same type already exists for this subject.",
            });
        }
        const existingQuestions = questions.filter((q) => q.id);
        const newQuestions = questions.filter((q) => !q.id);
        const updatedExam = yield prisma.exam.update({
            where: { id: Number(id) },
            data: {
                examType,
                subjectId,
                questions: {
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
                }
            },
            include: {
                subject: {
                    include: {
                        semester: true
                    }
                },
                questions: true,
            },
        });
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
