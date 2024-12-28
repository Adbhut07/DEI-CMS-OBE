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
exports.deleteExam = exports.updateExam = exports.createExam = exports.getExamById = exports.getExams = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield prisma.exam.findMany({
            include: {
                semester: true,
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
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const exam = yield prisma.exam.findUnique({
            where: { id: Number(id) },
            include: {
                semester: true,
                subject: true,
                questions: true,
            },
        });
        if (exam) {
            res.json(exam);
        }
        else {
            res.status(404).json({ success: false, message: 'Exam not found' });
        }
    }
    catch (error) {
        console.error("Error in getExamById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExamById = getExamById;
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { examType, subjectId, semesterId } = req.body;
    try {
        const newExam = yield prisma.exam.create({
            data: {
                examType,
                subject: { connect: { id: subjectId } },
                semester: { connect: { id: semesterId } },
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
// Update Exam
const updateExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { examType, subjectId, semesterId } = req.body;
    try {
        const updatedExam = yield prisma.exam.update({
            where: { id: Number(id) },
            data: {
                examType,
                subject: { connect: { id: subjectId } },
                semester: { connect: { id: semesterId } },
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
// Delete Exam
const deleteExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.exam.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in deleteExam controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteExam = deleteExam;
