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
exports.deleteSemester = exports.updateSemester = exports.createSemester = exports.getSemesterById = exports.getSemesters = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSemesters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semesters = yield prisma.semester.findMany();
        res.json(semesters);
    }
    catch (error) {
        console.error("Error in getSemesters controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSemesters = getSemesters;
const getSemesterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const semester = yield prisma.semester.findUnique({ where: { id: Number(id) } });
        if (semester) {
            res.json(semester);
        }
        else {
            res.status(404).json({ error: 'Semester not found' });
        }
    }
    catch (error) {
        console.error("Error in getSemesterById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSemesterById = getSemesterById;
const createSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterName, courseId } = req.body;
    try {
        const newSemester = yield prisma.semester.create({
            data: { semesterName, courseId }
        });
        res.status(201).json(newSemester);
    }
    catch (error) {
        console.error("Error in createSemester controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createSemester = createSemester;
const updateSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { semesterName, courseId } = req.body;
    try {
        const updatedSemester = yield prisma.semester.update({
            where: { id: Number(id) },
            data: { semesterName, courseId }
        });
        res.json(updatedSemester);
    }
    catch (error) {
        console.error("Error in updateSemester controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateSemester = updateSemester;
const deleteSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.semester.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in deleteSemester controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteSemester = deleteSemester;
