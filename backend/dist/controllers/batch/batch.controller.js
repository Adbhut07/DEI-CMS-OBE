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
exports.getStudentsInBatch = exports.getBatchesByCourse = exports.deleteBatch = exports.updateBatch = exports.getBatchById = exports.getAllBatches = exports.createBatch = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const batchSchema = zod_1.default.object({
    batchYear: zod_1.default.number().int().min(2000).max(2100).positive("Invalid batch year"),
    courseId: zod_1.default.number().int().positive("Course ID must be a positive integer"),
});
const createBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = batchSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { batchYear, courseId } = req.body;
        const batch = yield prisma.batch.create({
            data: { batchYear, courseId },
        });
        return res.status(201).json({
            success: true,
            message: "Batch created successfully",
            data: batch,
        });
    }
    catch (error) {
        console.error("Error creating batch:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createBatch = createBatch;
const getAllBatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batches = yield prisma.batch.findMany({
            include: { course: true },
        });
        return res.status(200).json({
            success: true,
            data: batches,
        });
    }
    catch (error) {
        console.error("Error fetching batches:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllBatches = getAllBatches;
const getBatchById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) {
            return res.status(400).json({ success: false, message: "Invalid Batch ID" });
        }
        const batch = yield prisma.batch.findUnique({
            where: { id: batchId },
            include: { course: true },
        });
        if (!batch) {
            return res.status(404).json({ success: false, message: "Batch not found" });
        }
        return res.status(200).json({
            success: true,
            data: batch,
        });
    }
    catch (error) {
        console.error("Error fetching batch by ID:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getBatchById = getBatchById;
const updateBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) {
            return res.status(400).json({ success: false, message: "Invalid Batch ID" });
        }
        const { batchYear } = req.body;
        if (!batchYear || batchYear < 2000 || batchYear > 2100) {
            return res.status(400).json({ success: false, message: "Invalid Batch Year" });
        }
        const updatedBatch = yield prisma.batch.update({
            where: { id: batchId },
            data: { batchYear },
        });
        return res.status(200).json({
            success: true,
            message: "Batch updated successfully",
            data: updatedBatch,
        });
    }
    catch (error) {
        console.error("Error updating batch:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateBatch = updateBatch;
const deleteBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) {
            return res.status(400).json({ success: false, message: "Invalid Batch ID" });
        }
        yield prisma.batch.delete({ where: { id: batchId } });
        return res.status(200).json({
            success: true,
            message: "Batch deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting batch:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteBatch = deleteBatch;
const getBatchesByCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }
        const batches = yield prisma.batch.findMany({
            where: { courseId },
        });
        return res.status(200).json({
            success: true,
            data: batches,
        });
    }
    catch (error) {
        console.error("Error fetching batches by course:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getBatchesByCourse = getBatchesByCourse;
const getStudentsInBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) {
            return res.status(400).json({ success: false, message: "Invalid Batch ID" });
        }
        const enrollments = yield prisma.enrollment.findMany({
            where: { batchId },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return res.status(200).json({
            success: true,
            data: enrollments.map((enrollment) => enrollment.student),
        });
    }
    catch (error) {
        console.error("Error fetching students in batch:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getStudentsInBatch = getStudentsInBatch;
