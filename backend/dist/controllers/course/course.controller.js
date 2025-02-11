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
exports.deleteCourse = exports.updateCourse = exports.getCourse = exports.getCourses = exports.createCourse = exports.createCourseSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
exports.createCourseSchema = zod_1.default.object({
    courseName: zod_1.default.string().min(3, "Course name must be at least 3 characters long"),
    createdById: zod_1.default.number().int().positive("Invalid user ID"),
    semesters: zod_1.default.array(zod_1.default.object({
        name: zod_1.default.string().min(3, "Semester name must be at least 3 characters long"),
        subjects: zod_1.default.array(zod_1.default.object({
            subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters long"),
            subjectCode: zod_1.default.string().min(2, "Subject code must be at least 2 characters long"),
            facultyId: zod_1.default.number().int().positive().optional(),
            units: zod_1.default.array(zod_1.default.object({
                unitNumber: zod_1.default.number().int().positive("Unit number must be positive"),
                description: zod_1.default.string().min(5, "Unit description must be at least 5 characters"),
            })).nonempty("At least one unit is required"),
        })).nonempty("At least one subject is required"),
    })).nonempty("At least one semester is required"),
});
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = exports.createCourseSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { courseName, createdById, semesters } = result.data;
        const existingCourse = yield prisma.course.findFirst({
            where: { courseName },
        });
        if (existingCourse) {
            return res.status(400).json({ message: "Course already exists" });
        }
        const course = yield prisma.course.create({
            data: {
                courseName,
                createdById,
                semesters: (semesters === null || semesters === void 0 ? void 0 : semesters.length)
                    ? {
                        create: semesters.map((semester) => {
                            var _a;
                            return ({
                                name: semester.name,
                                subjects: ((_a = semester.subjects) === null || _a === void 0 ? void 0 : _a.length)
                                    ? {
                                        create: semester.subjects.map((subject) => ({
                                            subjectName: subject.subjectName,
                                            subjectCode: subject.subjectCode,
                                            faculty: subject.facultyId
                                                ? { connect: { id: subject.facultyId } }
                                                : undefined,
                                            units: {
                                                create: subject.units.map((unit) => ({
                                                    unitNumber: unit.unitNumber,
                                                    description: unit.description,
                                                })),
                                            },
                                        })),
                                    }
                                    : undefined,
                            });
                        }),
                    }
                    : undefined,
            },
            include: {
                batches: true,
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
        const courses = yield prisma.course.findMany({
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
                createdBy: {
                    select: { id: true, name: true, email: true, role: true },
                },
            },
        });
        return res.status(200).json({
            success: true,
            data: courses,
        });
    }
    catch (error) {
        console.error("Error in getCourses:", error.message);
        return res.status(500).json({
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
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }
        const course = yield prisma.course.findUnique({
            where: { id },
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
                createdBy: {
                    select: { id: true, name: true, email: true, role: true },
                },
                // enrollments: {
                //   include: {
                //     student: {
                //       select: { id: true, name: true, email: true, role: true },
                //     },
                //   },
                // },
            },
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        console.error("Error in getCourse:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getCourse = getCourse;
const updateCourseSchema = zod_1.default.object({
    courseName: zod_1.default.string().min(3, "Course name must be at least 3 characters long"),
    semesters: zod_1.default
        .array(zod_1.default.object({
        id: zod_1.default.number().optional(), // Optional for new semesters
        name: zod_1.default.string().min(3, "Semester name must be at least 3 characters"),
        subjects: zod_1.default
            .array(zod_1.default.object({
            id: zod_1.default.number().optional(), // Optional for new subjects
            subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters"),
            subjectCode: zod_1.default.string().min(2, "Subject code must be at least 2 characters"),
            facultyId: zod_1.default.number().optional(),
            units: zod_1.default
                .array(zod_1.default.object({
                id: zod_1.default.number().optional(), // Optional for new units
                unitNumber: zod_1.default.number().min(1, "Unit number must be at least 1"),
                description: zod_1.default.string().min(5, "Description must be at least 5 characters"),
            }))
                .optional()
                .default([]), // Default empty array if units are not provided
        }))
            .optional()
            .default([]), // Default empty array if subjects are not provided
    }))
        .optional()
        .default([]), // Default empty array if semesters are not provided
});
// Update Course with Semesters and Subjects
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }
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
        const existingCourse = yield prisma.course.findUnique({
            where: { id },
            select: {
                createdById: true,
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                units: {
                                    select: {
                                        id: true,
                                        attainment: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        const updatedCourse = yield prisma.course.update({
            where: { id },
            data: {
                courseName,
                createdById: existingCourse.createdById,
                semesters: {
                    upsert: semesters === null || semesters === void 0 ? void 0 : semesters.map((semester) => {
                        var _a, _b;
                        return ({
                            where: { id: (_a = semester.id) !== null && _a !== void 0 ? _a : -1 },
                            create: {
                                name: semester.name,
                                subjects: {
                                    create: semester.subjects.map((subject) => ({
                                        subjectName: subject.subjectName,
                                        subjectCode: subject.subjectCode,
                                        facultyId: subject.facultyId,
                                        units: {
                                            create: subject.units.map((unit) => ({
                                                unitNumber: unit.unitNumber,
                                                description: unit.description,
                                                attainment: 0.0,
                                            })),
                                        },
                                    })),
                                },
                            },
                            update: {
                                name: semester.name,
                                subjects: {
                                    upsert: (_b = semester.subjects) === null || _b === void 0 ? void 0 : _b.map((subject) => {
                                        var _a, _b, _c;
                                        return ({
                                            where: { id: (_a = subject.id) !== null && _a !== void 0 ? _a : -1 },
                                            create: {
                                                subjectName: subject.subjectName,
                                                subjectCode: subject.subjectCode,
                                                facultyId: subject.facultyId,
                                                units: {
                                                    create: (_b = subject.units) === null || _b === void 0 ? void 0 : _b.map((unit) => ({
                                                        unitNumber: unit.unitNumber,
                                                        description: unit.description,
                                                        attainment: 0.0,
                                                    })),
                                                },
                                            },
                                            update: {
                                                subjectName: subject.subjectName,
                                                subjectCode: subject.subjectCode,
                                                facultyId: subject.facultyId,
                                                units: {
                                                    upsert: (_c = subject.units) === null || _c === void 0 ? void 0 : _c.map((unit) => {
                                                        var _a;
                                                        return ({
                                                            where: { id: (_a = unit.id) !== null && _a !== void 0 ? _a : -1 },
                                                            create: {
                                                                unitNumber: unit.unitNumber,
                                                                description: unit.description,
                                                                attainment: 0.0,
                                                            },
                                                            update: Object.assign({ unitNumber: unit.unitNumber, description: unit.description }, (unit.id ? {} : { attainment: 0.0 })),
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
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    }
    catch (error) {
        console.error("Error in updateCourse:", error.message);
        return res.status(500).json({
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
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }
        // Start a transaction to ensure all deletions are atomic
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Delete all CO_PO_Mappings related to units in this course
            yield tx.cO_PO_Mapping.deleteMany({
                where: {
                    courseOutcome: {
                        subject: {
                            semester: {
                                courseId: id
                            }
                        }
                    }
                }
            });
            // 2. Delete all CO_Attainments related to units in this course
            yield tx.cO_Attainment.deleteMany({
                where: {
                    co: {
                        subject: {
                            semester: {
                                courseId: id
                            }
                        }
                    }
                }
            });
            // 3. Delete all PO_Attainments for this course's batches
            yield tx.pO_Attainment.deleteMany({
                where: {
                    batch: {
                        courseId: id
                    }
                }
            });
            // 4. Delete all marks for questions in exams
            yield tx.marks.deleteMany({
                where: {
                    exam: {
                        subject: {
                            semester: {
                                courseId: id
                            }
                        }
                    }
                }
            });
            // 5. Delete all questions in exams
            yield tx.question.deleteMany({
                where: {
                    exam: {
                        subject: {
                            semester: {
                                courseId: id
                            }
                        }
                    }
                }
            });
            // 6. Delete all exams
            yield tx.exam.deleteMany({
                where: {
                    subject: {
                        semester: {
                            courseId: id
                        }
                    }
                }
            });
            // 7. Delete all units
            yield tx.unit.deleteMany({
                where: {
                    subject: {
                        semester: {
                            courseId: id
                        }
                    }
                }
            });
            // 8. Delete all subjects
            yield tx.subject.deleteMany({
                where: {
                    semester: {
                        courseId: id
                    }
                }
            });
            // 9. Delete all program outcomes
            yield tx.programOutcome.deleteMany({
                where: {
                    courseId: id
                }
            });
            // 10. Delete all enrollments in batches
            yield tx.enrollment.deleteMany({
                where: {
                    batch: {
                        courseId: id
                    }
                }
            });
            // 11. Delete all batches
            yield tx.batch.deleteMany({
                where: {
                    courseId: id
                }
            });
            // 12. Delete all semesters
            yield tx.semester.deleteMany({
                where: {
                    courseId: id
                }
            });
            // 13. Finally, delete the course itself
            yield tx.course.delete({
                where: { id }
            });
        }));
        return res.status(200).json({
            success: true,
            message: "Course and all related data deleted successfully"
        });
    }
    catch (error) {
        console.error("Error in deleteCourse:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});
exports.deleteCourse = deleteCourse;
