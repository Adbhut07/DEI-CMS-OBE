"use strict";
// **************** New Approach ****************
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
exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getAllSubjectsDetails = exports.getAllSubjects = exports.createSubject = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const subjectSchema = zod_1.default.object({
    subjectName: zod_1.default.string().min(1, "Subject name is required"),
    subjectCode: zod_1.default.string().min(1, "Subject code is required"),
});
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = subjectSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { subjectName, subjectCode } = req.body;
        const subject = yield prisma.subject.create({
            data: { subjectName, subjectCode },
        });
        return res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: subject,
        });
    }
    catch (error) {
        console.error("Error creating subject:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createSubject = createSubject;
const getAllSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield prisma.subject.findMany();
        return res.status(200).json({ success: true, data: subjects });
    }
    catch (error) {
        console.error("Error fetching subjects:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllSubjects = getAllSubjects;
const getAllSubjectsDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield prisma.subject.findMany({
            include: {
                units: true,
                courseMappings: {
                    include: {
                        course: true,
                        faculty: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).json({ success: true, data: subjects });
    }
    catch (error) {
        console.error("Error fetching subjects:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllSubjectsDetails = getAllSubjectsDetails;
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjectId = parseInt(req.params.subjectId);
        if (isNaN(subjectId)) {
            return res.status(400).json({ success: false, message: "Invalid Subject ID" });
        }
        const subject = yield prisma.subject.findUnique({
            where: { id: subjectId },
            include: {
                units: true, // Fetch all units related to the subject
                courseMappings: {
                    include: {
                        course: true, // Fetch the course details linked to this subject
                        faculty: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        return res.status(200).json({ success: true, data: subject });
    }
    catch (error) {
        console.error("Error fetching subject by ID:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSubjectById = getSubjectById;
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjectId = parseInt(req.params.subjectId);
        if (isNaN(subjectId)) {
            return res.status(400).json({ success: false, message: "Invalid Subject ID" });
        }
        const { subjectName, subjectCode } = req.body;
        if (!subjectName || !subjectCode) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }
        const updatedSubject = yield prisma.subject.update({
            where: { id: subjectId },
            data: { subjectName, subjectCode },
        });
        return res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            data: updatedSubject,
        });
    }
    catch (error) {
        console.error("Error updating subject:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjectId = parseInt(req.params.subjectId);
        if (isNaN(subjectId)) {
            return res.status(400).json({ success: false, message: "Invalid Subject ID" });
        }
        yield prisma.subject.delete({ where: { id: subjectId } });
        return res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting subject:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteSubject = deleteSubject;
