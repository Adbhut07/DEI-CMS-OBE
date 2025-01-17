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
const unitSchema = zod_1.default.object({
    id: zod_1.default.number().optional(),
    unitNumber: zod_1.default.number().positive("Unit number must be positive"),
    description: zod_1.default.string().min(3, "Unit description must be at least 3 characters"),
});
const subjectSchema = zod_1.default.object({
    id: zod_1.default.number().optional(),
    subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters"),
    facultyId: zod_1.default.number().positive("Faculty ID must be positive").optional(),
    units: zod_1.default.array(unitSchema).optional(),
});
const semesterSchema = zod_1.default.object({
    id: zod_1.default.number().optional(),
    name: zod_1.default.string().min(3, "Semester name must be at least 3 characters"),
    subjects: zod_1.default.array(subjectSchema).optional(),
});
const courseSchema = zod_1.default.object({
    courseName: zod_1.default.string().min(3, "Course name must be at least 3 characters"),
    semesters: zod_1.default.array(semesterSchema).optional(),
});
const updateUnitSchema = zod_1.default.object({
    unitNumber: zod_1.default.number().positive("Unit number must be positive"),
    description: zod_1.default.string().min(3, "Unit description must be at least 3 characters"),
});
const updateSubjectSchema = zod_1.default.object({
    subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters"),
    facultyId: zod_1.default.number().positive("Faculty ID must be positive").optional(),
    units: zod_1.default.array(unitSchema).optional(),
});
const updateSemesterSchema = zod_1.default.object({
    id: zod_1.default.number().optional(),
    name: zod_1.default.string().min(3, "Semester name must be at least 3 characters"),
    subjects: zod_1.default.array(subjectSchema).optional(),
});
const updateCourseSchema = zod_1.default.object({
    courseName: zod_1.default.string().min(3, "Course name must be at least 3 characters"),
    semesters: zod_1.default.array(semesterSchema).optional(),
});
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = courseSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const createdById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!createdById) {
            return res.status(400).json({
                success: false,
                message: "created By Id is not present",
            });
        }
        const { courseName, semesters } = result.data;
        const course = yield prisma.course.create({
            data: {
                courseName,
                createdById,
                semesters: semesters
                    ? {
                        create: semesters.map((semester) => ({
                            name: semester.name,
                            subjects: semester.subjects
                                ? {
                                    create: semester.subjects.map((subject) => ({
                                        subjectName: subject.subjectName,
                                        facultyId: subject.facultyId,
                                        units: subject.units
                                            ? {
                                                create: subject.units.map((unit) => ({
                                                    unitNumber: unit.unitNumber,
                                                    description: unit.description,
                                                })),
                                            }
                                            : undefined,
                                    })),
                                }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                units: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Course created successfully with semesters, subjects, and units",
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
                        subjects: {
                            include: {
                                units: true,
                            }
                        },
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
                        subjects: {
                            include: {
                                units: true,
                            }
                        },
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
        const validationResult = updateCourseSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.error("Validation Errors:", validationResult.error.format());
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: validationResult.error.format(),
            });
        }
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        const { courseName, semesters } = validationResult.data;
        const updatedCourse = yield prisma.course.update({
            where: { id },
            data: {
                courseName,
                semesters: {
                    upsert: semesters === null || semesters === void 0 ? void 0 : semesters.map((semester) => {
                        var _a, _b, _c;
                        return ({
                            where: {
                                id: (_a = semester.id) !== null && _a !== void 0 ? _a : -1, // Use -1 for new semesters
                            },
                            create: {
                                name: semester.name,
                                subjects: {
                                    create: (_b = semester.subjects) === null || _b === void 0 ? void 0 : _b.map((subject) => {
                                        var _a;
                                        return ({
                                            subjectName: subject.subjectName,
                                            units: {
                                                create: (_a = subject.units) === null || _a === void 0 ? void 0 : _a.map((unit) => ({
                                                    unitNumber: unit.unitNumber,
                                                    description: unit.description,
                                                })),
                                            },
                                        });
                                    }),
                                },
                            },
                            update: {
                                name: semester.name,
                                subjects: {
                                    upsert: (_c = semester.subjects) === null || _c === void 0 ? void 0 : _c.map((subject) => {
                                        var _a, _b, _c;
                                        return ({
                                            where: {
                                                id: (_a = subject.id) !== null && _a !== void 0 ? _a : -1,
                                            },
                                            create: {
                                                subjectName: subject.subjectName,
                                                units: {
                                                    create: (_b = subject.units) === null || _b === void 0 ? void 0 : _b.map((unit) => ({
                                                        unitNumber: unit.unitNumber,
                                                        description: unit.description,
                                                    })),
                                                },
                                            },
                                            update: {
                                                subjectName: subject.subjectName,
                                                units: {
                                                    upsert: (_c = subject.units) === null || _c === void 0 ? void 0 : _c.map((unit) => {
                                                        var _a;
                                                        return ({
                                                            where: {
                                                                id: (_a = unit.id) !== null && _a !== void 0 ? _a : -1,
                                                            },
                                                            create: {
                                                                unitNumber: unit.unitNumber,
                                                                description: unit.description,
                                                            },
                                                            update: {
                                                                unitNumber: unit.unitNumber,
                                                                description: unit.description,
                                                            },
                                                        });
                                                    }),
                                                },
                                            },
                                        });
                                    }),
                                },
                            },
                        });
                    }),
                },
            },
            include: {
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                units: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Course updated successfully with semesters, subjects, and units",
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
        // First, delete all related enrollments
        yield prisma.enrollment.deleteMany({
            where: { courseId: id },
        });
        // Delete all related marks for exams in the course's semesters
        yield prisma.marks.deleteMany({
            where: {
                exam: {
                    semester: {
                        courseId: id,
                    },
                },
            },
        });
        // Delete all questions for exams in the course's semesters
        yield prisma.question.deleteMany({
            where: {
                exam: {
                    semester: {
                        courseId: id,
                    },
                },
            },
        });
        // Delete all exams in the course's semesters
        yield prisma.exam.deleteMany({
            where: {
                semester: {
                    courseId: id,
                },
            },
        });
        // Delete all course outcomes for subjects in the course's semesters
        yield prisma.courseOutcome.deleteMany({
            where: {
                Subject: {
                    semester: {
                        courseId: id,
                    },
                },
            },
        });
        // Delete all units for subjects in the course's semesters
        yield prisma.unit.deleteMany({
            where: {
                subject: {
                    semester: {
                        courseId: id,
                    },
                },
            },
        });
        // Delete all subjects in the course's semesters
        yield prisma.subject.deleteMany({
            where: {
                semester: {
                    courseId: id,
                },
            },
        });
        // Delete all semesters for the course
        yield prisma.semester.deleteMany({
            where: { courseId: id },
        });
        // Finally, delete the course itself
        yield prisma.course.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Course and all related data deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteCourse:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.deleteCourse = deleteCourse;
