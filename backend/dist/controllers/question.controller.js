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
exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getQuestions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield prisma.question.findMany();
        res.json(questions);
    }
    catch (error) {
        console.error("Error in getQuestions controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getQuestions = getQuestions;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const question = yield prisma.question.findUnique({
            where: { id: Number(id) }
        });
        res.json(question);
    }
    catch (error) {
        console.error("Error in getQuestionById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getQuestionById = getQuestionById;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionNumber, examId } = req.body;
    try {
        const newQuestion = yield prisma.question.create({
            data: { questionNumber, examId }
        });
        res.status(201).json(newQuestion);
    }
    catch (error) {
        console.error("Error in createQuestion controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createQuestion = createQuestion;
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { questionNumber, examId } = req.body;
    try {
        const updatedQuestion = yield prisma.question.update({
            where: { id: Number(id) },
            data: { questionNumber, examId }
        });
        res.json(updatedQuestion);
    }
    catch (error) {
        console.error("Error in updateQuestion controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateQuestion = updateQuestion;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.question.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in deleteQuestion controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteQuestion = deleteQuestion;
