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
exports.updateEnrollment = exports.deleteEnrollment = exports.createEnrollment = exports.getEnrollmentById = exports.getEnrollments = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getEnrollments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollments = yield prisma.enrollment.findMany();
        res.json(enrollments);
    }
    catch (error) {
        console.error("Error in getEnrollments controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getEnrollments = getEnrollments;
const getEnrollmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const enrollment = yield prisma.enrollment.findUnique({
            where: { id: Number(id) }
        });
        res.json(enrollment);
    }
    catch (error) {
        console.error("Error in getEnrollmentById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getEnrollmentById = getEnrollmentById;
const createEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, courseId, semesterId, subjectId } = req.body;
    try {
        const newEnrollment = yield prisma.enrollment.create({
            data: { studentId, courseId, semesterId, subjectId }
        });
        res.status(201).json(newEnrollment);
    }
    catch (error) {
        console.error("Error in createEnrollment controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createEnrollment = createEnrollment;
const deleteEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.enrollment.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in deleteEnrollment controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteEnrollment = deleteEnrollment;
const updateEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { studentId, courseId, semesterId, subjectId } = req.body;
    try {
        const updatedEnrollment = yield prisma.enrollment.update({
            where: { id: Number(id) },
            data: { studentId, courseId, semesterId, subjectId }
        });
        res.json(updatedEnrollment);
    }
    catch (error) {
        console.error("Error in updateEnrollment controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateEnrollment = updateEnrollment;
