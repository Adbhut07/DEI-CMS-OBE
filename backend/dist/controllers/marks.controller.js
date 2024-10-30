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
exports.deleteMarks = exports.updateMarks = exports.createMarks = exports.getMarksByStudentId = exports.getMarks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all marks
const getMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const marks = yield prisma.marks.findMany({
            include: {
                student: true,
                question: {
                    include: {
                        exam: true
                    }
                },
                uploadedBy: true
            }
        });
        res.json(marks);
    }
    catch (error) {
        console.error("Error in getMarks controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getMarks = getMarks;
// Get marks by student ID
const getMarksByStudentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    try {
        const marks = yield prisma.marks.findMany({
            where: { studentId: Number(studentId) },
            include: {
                question: {
                    include: {
                        exam: true
                    }
                },
                uploadedBy: true
            }
        });
        if (marks.length > 0) {
            res.json(marks);
        }
        else {
            res.status(404).json({ error: 'No marks found for the student' });
        }
    }
    catch (error) {
        console.error("Error in getMarksByStudentId controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getMarksByStudentId = getMarksByStudentId;
// Create marks for a student
const createMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, questionId, marksObtained, uploadedById } = req.body;
    try {
        const newMarks = yield prisma.marks.create({
            data: {
                studentId,
                questionId,
                marksObtained,
                uploadedById
            }
        });
        res.status(201).json(newMarks);
    }
    catch (error) {
        console.error("Error in createMarks controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createMarks = createMarks;
// Update marks for a student
const updateMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { marksObtained } = req.body;
    try {
        const updatedMarks = yield prisma.marks.update({
            where: { id: Number(id) },
            data: { marksObtained }
        });
        res.json(updatedMarks);
    }
    catch (error) {
        console.error("Error in updateMarks controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateMarks = updateMarks;
// Delete marks
const deleteMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.marks.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in deleteMarks controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteMarks = deleteMarks;
