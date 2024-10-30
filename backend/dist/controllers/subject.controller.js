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
exports.deleteSubject = exports.updateSubject = exports.createSubject = exports.getSubjectById = exports.getSubjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield prisma.subject.findMany();
        res.json(subjects);
    }
    catch (error) {
        console.error("Error in getSubjects controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSubjects = getSubjects;
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const subject = yield prisma.subject.findUnique({ where: { id: Number(id) } });
        if (subject) {
            res.json(subject);
        }
        else {
            res.status(404).json({ error: 'Subject not found' });
        }
    }
    catch (error) {
        console.error("Error in getSubjectById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSubjectById = getSubjectById;
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subjectName, semesterId } = req.body;
    try {
        const newSubject = yield prisma.subject.create({
            data: { subjectName, semesterId }
        });
        res.status(201).json(newSubject);
    }
    catch (error) {
        console.error("Error in createSubject controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createSubject = createSubject;
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { subjectName, semesterId } = req.body;
    try {
        const updatedSubject = yield prisma.subject.update({
            where: { id: Number(id) },
            data: { subjectName, semesterId }
        });
        res.json(updatedSubject);
    }
    catch (error) {
        console.error("Error in updateSubject controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.subject.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in deleteSubject controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteSubject = deleteSubject;
