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
exports.deleteMarks = exports.updateMarks = exports.getMarksByExam = exports.uploadMarks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const uploadMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { examId, marks } = req.body;
    const uploadedById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!uploadedById) {
        return res.status(401).json({ success: false, message: 'Unauthorized: User not found.' });
    }
    try {
        const exam = yield prisma.exam.findUnique({
            where: { id: Number(examId) },
            include: { questions: true },
        });
        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found.' });
        }
        const questionIds = exam.questions.map((q) => q.id);
        for (const studentMarks of marks) {
            for (const markEntry of studentMarks.marks) {
                if (!questionIds.includes(markEntry.questionId)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid questionId: ${markEntry.questionId} for examId: ${examId}`,
                    });
                }
                const question = exam.questions.find(q => q.id === markEntry.questionId);
                if (question && markEntry.marksObtained > question.marksAllocated) {
                    return res.status(400).json({
                        success: false,
                        message: `Marks obtained for questionId ${markEntry.questionId} exceeds allocated marks.`
                    });
                }
            }
        }
        const markEntries = marks.flatMap((studentMarks) => studentMarks.marks.map((markEntry) => ({
            studentId: studentMarks.studentId,
            questionId: markEntry.questionId,
            examId,
            marksObtained: markEntry.marksObtained,
            uploadedById,
        })));
        yield prisma.$transaction(markEntries.map((entry) => prisma.marks.upsert({
            where: {
                studentId_questionId_examId: {
                    studentId: entry.studentId,
                    questionId: entry.questionId,
                    examId: entry.examId,
                },
            },
            update: { marksObtained: entry.marksObtained },
            create: entry,
        })));
        res.status(201).json({ success: true, message: 'Marks uploaded successfully.' });
    }
    catch (error) {
        console.error('Error uploading marks:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.uploadMarks = uploadMarks;
const getMarksByExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { examId } = req.params;
    try {
        const marks = yield prisma.marks.findMany({
            where: { examId: Number(examId) },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
                question: {
                    select: { id: true, questionText: true },
                },
            },
        });
        if (!marks.length) {
            return res.status(404).json({ success: false, message: 'No marks found for the given exam.' });
        }
        res.status(200).json({ success: true, data: marks });
    }
    catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.getMarksByExam = getMarksByExam;
const updateMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, questionId, examId } = req.params;
    const { marksObtained } = req.body;
    try {
        const mark = yield prisma.marks.update({
            where: {
                studentId_questionId_examId: {
                    studentId: Number(studentId),
                    questionId: Number(questionId),
                    examId: Number(examId),
                },
            },
            data: { marksObtained },
        });
        res.status(200).json({ success: true, data: mark });
    }
    catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.updateMarks = updateMarks;
const deleteMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, questionId, examId } = req.params;
    try {
        yield prisma.marks.delete({
            where: {
                studentId_questionId_examId: {
                    studentId: Number(studentId),
                    questionId: Number(questionId),
                    examId: Number(examId),
                },
            },
        });
        res.status(200).json({ success: true, message: 'Marks deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting marks:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.deleteMarks = deleteMarks;
