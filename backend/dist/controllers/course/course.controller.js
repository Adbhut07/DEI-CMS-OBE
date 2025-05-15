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
exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const courseSchema = zod_1.default.object({
    courseName: zod_1.default.string().min(3, "Course name must be at least 3 characters long"),
});
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = courseSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { courseName } = req.body;
        const createdById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!createdById) {
            return res.status(400).json({ success: false, message: "Invalid req.user ID" });
        }
        const course = yield prisma.course.create({
            data: { courseName, createdById },
        });
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    }
    catch (error) {
        console.error("Error creating course:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createCourse = createCourse;
const getAllCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield prisma.course.findMany({
            include: {
                createdBy: true,
                subjects: {
                    include: {
                        subject: true
                    }
                }
            }
        });
        return res.status(200).json({ success: true, data: courses });
    }
    catch (error) {
        console.error("Error fetching courses:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllCourses = getAllCourses;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        //console.log(courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }
        const course = yield prisma.course.findUnique({
            where: { id: courseId },
            include: { createdBy: true, subjects: true, batches: true },
        });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        return res.status(200).json({ success: true, data: course });
    }
    catch (error) {
        console.error("Error fetching course by ID:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getCourseById = getCourseById;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }
        const { courseName } = req.body;
        if (!courseName || courseName.length < 3) {
            return res.status(400).json({ success: false, message: "Invalid Course Name" });
        }
        const updatedCourse = yield prisma.course.update({
            where: { id: courseId },
            data: { courseName },
        });
        return res.status(200).json({ success: true, message: "Course updated successfully", data: updatedCourse });
    }
    catch (error) {
        console.error("Error updating course:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }
        yield prisma.course.delete({ where: { id: courseId } });
        return res.status(200).json({ success: true, message: "Course deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting course:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteCourse = deleteCourse;
