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
exports.deleteCourse = exports.updateCourse = exports.getCourse = exports.getCourses = exports.createCourse = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const semesterSchema = zod_1.default.object({
    name: zod_1.default.string().min(3, "Semester name must be at least 3 characters"),
    subjects: zod_1.default
        .array(zod_1.default.object({
        subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters"),
    }))
        .optional(),
});
const courseSchema = zod_1.default.object({
    courseName: zod_1.default.string().min(3, "Course name must be at least 3 characters"),
    createdById: zod_1.default.number().int("Invalid creator ID").positive(),
    semesters: zod_1.default.array(semesterSchema).optional(),
});
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = courseSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { courseName, createdById, semesters } = result.data;
        const course = yield prisma.course.create({
            data: {
                courseName,
                createdById,
                semesters: semesters
                    ? {
                        create: semesters.map((semester) => ({
                            name: semester.name,
                            subjects: semester.subjects
                                ? { create: semester.subjects }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                semesters: {
                    include: {
                        subjects: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    }
    catch (error) {
        console.error("Error in createCourse:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.createCourse = createCourse;
// Get All Courses with Semesters and Subjects
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        const courses = yield prisma.course.findMany({
            include: {
                semesters: {
                    include: {
                        subjects: true,
                    },
                },
                createdBy: true,
            },
        });
        res.status(200).json({
            success: true,
            data: courses,
        });
    }
    catch (error) {
        console.error("Error in getCourses:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getCourses = getCourses;
// Get Single Course with Semesters and Subjects
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const course = yield prisma.course.findUnique({
            where: { id },
            include: {
                semesters: {
                    include: {
                        subjects: true,
                    },
                },
                createdBy: true,
                Enrollment: true,
            },
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        res.status(200).json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        console.error("Error in getCourse:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getCourse = getCourse;
// Update Course with Semesters and Subjects
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = courseSchema.partial().safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { courseName, semesters } = result.data;
        const updatedCourse = yield prisma.course.update({
            where: { id },
            data: {
                courseName,
                semesters: semesters
                    ? {
                        create: semesters.map((semester) => ({
                            name: semester.name,
                            subjects: semester.subjects
                                ? { create: semester.subjects }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                semesters: {
                    include: {
                        subjects: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    }
    catch (error) {
        console.error("Error in updateCourse:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateCourse = updateCourse;
// Delete Course
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield prisma.course.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteCourse:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.deleteCourse = deleteCourse;
