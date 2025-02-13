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
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const semesterSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Semester name must be at least 3 characters"),
    courseId: zod_1.z.number().int("Invalid course ID")
});
const updateSemesterSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Semester name must be at least 3 characters").optional(),
    courseId: zod_1.z.number().int("Invalid course ID").optional()
});
// Get All Semesters
const getSemesters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semesters = yield prisma.semester.findMany({
            include: {
                course: {
                    select: {
                        id: true,
                        courseName: true,
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                subjects: {
                    include: {
                        faculty: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
            },
        });
        res.json({
            success: true,
            data: semesters
        });
    }
    catch (error) {
        console.error("Error in getSemesters controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSemesters = getSemesters;
// Get Semester by ID
const getSemesterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const semesterId = parseInt(id);
        if (isNaN(semesterId)) {
            res.status(400).json({
                success: false,
                message: "Invalid semester ID"
            });
            return;
        }
        const semester = yield prisma.semester.findUnique({
            where: { id: semesterId },
            include: {
                course: {
                    select: {
                        id: true,
                        courseName: true,
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                subjects: {
                    include: {
                        faculty: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        units: true,
                        // exams: true
                    }
                }
            }
        });
        if (!semester) {
            res.status(404).json({
                success: false,
                message: 'Semester not found'
            });
            return;
        }
        res.json({
            success: true,
            data: semester
        });
    }
    catch (error) {
        console.error("Error in getSemesterById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSemesterById = getSemesterById;
// Create Semester
const createSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = semesterSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format()
            });
            return;
        }
        const { name, courseId } = result.data;
        const courseExists = yield prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!courseExists) {
            res.status(404).json({
                success: false,
                message: "Course not found"
            });
            return;
        }
        const existingSemester = yield prisma.semester.findFirst({
            where: {
                name,
                courseId
            }
        });
        if (existingSemester) {
            res.status(400).json({
                success: false,
                message: "Semester with this name already exists in the course"
            });
            return;
        }
        const newSemester = yield prisma.semester.create({
            data: {
                name,
                course: { connect: { id: courseId } }, // Connect to the course
            },
            include: {
                course: {
                    select: {
                        id: true,
                        courseName: true
                    }
                }
            }
        });
        res.status(201).json({
            success: true,
            message: "Semester created successfully",
            data: newSemester
        });
    }
    catch (error) {
        console.error("Error in createSemester controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createSemester = createSemester;
// Update Semester
const updateSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const semesterId = parseInt(id);
        if (isNaN(semesterId)) {
            res.status(400).json({
                success: false,
                message: "Invalid semester ID"
            });
            return;
        }
        const result = updateSemesterSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format()
            });
            return;
        }
        const { name, courseId } = result.data;
        const existingSemester = yield prisma.semester.findUnique({
            where: { id: semesterId }
        });
        if (!existingSemester) {
            res.status(404).json({
                success: false,
                message: "Semester not found"
            });
            return;
        }
        if (courseId) {
            const courseExists = yield prisma.course.findUnique({
                where: { id: courseId }
            });
            if (!courseExists) {
                res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
                return;
            }
        }
        const updatedSemester = yield prisma.semester.update({
            where: { id: semesterId },
            data: Object.assign({ name }, (courseId && { course: { connect: { id: courseId } } })),
            include: {
                course: {
                    select: {
                        id: true,
                        courseName: true
                    }
                },
                subjects: true
            }
        });
        res.status(201).json({
            success: true,
            message: "Semester updated successfully",
            data: updatedSemester
        });
    }
    catch (error) {
        console.error("Error in updateSemester controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateSemester = updateSemester;
// Delete Semester
const deleteSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const semesterId = parseInt(id);
        if (isNaN(semesterId)) {
            res.status(400).json({
                success: false,
                message: "Invalid semester ID"
            });
            return;
        }
        // Check if semester exists
        const semester = yield prisma.semester.findUnique({
            where: { id: semesterId },
            include: {
                subjects: true
            }
        });
        if (!semester) {
            res.status(404).json({
                success: false,
                message: "Semester not found"
            });
            return;
        }
        // Check for associated subjects
        if (semester.subjects.length > 0) {
            res.status(400).json({
                success: false,
                message: "Cannot delete semester with associated subjects. Please delete the subjects first."
            });
            return;
        }
        yield prisma.semester.delete({
            where: { id: semesterId }
        });
        res.status(204).json({
            success: true,
            message: "Semester deleted successfully"
        });
    }
    catch (error) {
        console.error("Error in deleteSemester controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteSemester = deleteSemester;
