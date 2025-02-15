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
exports.deleteSubject = exports.updateSubject = exports.getSubject = exports.getSubjects = exports.assignFacultyToSubject = exports.createSubject = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const subjectSchema = zod_1.default.object({
    subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters"),
    subjectCode: zod_1.default.string().min(2, "Subject code must be at least 2 characters"),
    semesterId: zod_1.default.number().int("Invalid semester ID"),
    facultyId: zod_1.default.number().int("Invalid faculty ID").optional(),
});
const updateSubjectSchema = zod_1.default.object({
    subjectName: zod_1.default.string().min(3, "Subject name must be at least 3 characters").optional(),
    subjectCode: zod_1.default.string().min(2, "Subject code must be at least 2 characters").optional(),
    semesterId: zod_1.default.number().int("Invalid semester ID").optional(),
    facultyId: zod_1.default.number().int("Invalid faculty ID").optional(),
});
const assignFacultySchema = zod_1.default.object({
    subjectId: zod_1.default.number().int("Invalid subject ID"),
    semesterId: zod_1.default.number().int("Invalid semester ID"),
    facultyId: zod_1.default.number().int("Invalid faculty ID"),
});
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = subjectSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
            return;
        }
        const { subjectName, subjectCode, semesterId, facultyId } = result.data;
        // Verify semester exists
        const semesterExists = yield prisma.semester.findUnique({
            where: { id: semesterId },
            include: { course: true }
        });
        if (!semesterExists) {
            res.status(404).json({
                success: false,
                message: "Semester not found"
            });
            return;
        }
        const existingSubject = yield prisma.subject.findFirst({
            where: {
                subjectCode,
                semester: {
                    courseId: semesterExists.courseId
                }
            }
        });
        if (existingSubject) {
            res.status(400).json({
                success: false,
                message: "Subject code already exists in this course"
            });
            return;
        }
        if (facultyId) {
            const faculty = yield prisma.user.findFirst({
                where: {
                    id: facultyId,
                    role: "Faculty"
                }
            });
            if (!faculty) {
                res.status(404).json({
                    success: false,
                    message: "Faculty not found or user is not a faculty member"
                });
                return;
            }
        }
        const subject = yield prisma.subject.create({
            data: {
                subjectName,
                subjectCode,
                semesterId,
                facultyId
            },
            include: {
                semester: true,
                faculty: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: subject
        });
    }
    catch (error) {
        console.error("Error in createSubject:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.createSubject = createSubject;
const assignFacultyToSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const result = assignFacultySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { subjectId, semesterId, facultyId } = result.data;
        const courseExists = yield prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });
        if (!courseExists) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        const subject = yield prisma.subject.findFirst({
            where: {
                id: subjectId,
                semesterId: semesterId, // Ensure semesterId matches
                semester: {
                    courseId: parseInt(courseId), // Ensure courseId matches
                },
            },
        });
        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        const faculty = yield prisma.user.findUnique({
            where: { id: facultyId },
        });
        if (!faculty || faculty.role !== "Faculty") {
            return res.status(403).json({
                success: false,
                message: "Invalid or unauthorized faculty ID",
            });
        }
        const updatedSubject = yield prisma.subject.update({
            where: { id: subjectId },
            data: { facultyId },
        });
        res.status(200).json({
            success: true,
            message: "Faculty assigned to subject successfully",
            data: updatedSubject,
        });
    }
    catch (error) {
        console.error("Error in assignFacultyToSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.assignFacultyToSubject = assignFacultyToSubject;
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { semesterId } = req.query;
        const whereClause = semesterId
            ? { semesterId: Number(semesterId) }
            : {};
        const subjects = yield prisma.subject.findMany({
            where: whereClause,
            include: { semester: { include: { course: true } }, faculty: true, units: true, exams: true },
        });
        res.status(200).json({
            success: true,
            data: subjects,
        });
    }
    catch (error) {
        console.error("Error in getSubjects:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getSubjects = getSubjects;
const getSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid subject ID"
            });
            return;
        }
        const subject = yield prisma.subject.findUnique({
            where: { id },
            include: { semester: { include: { course: true } }, faculty: { select: { id: true, name: true, email: true } }, units: true, exams: true },
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        res.status(200).json({
            success: true,
            data: subject,
        });
    }
    catch (error) {
        console.error("Error in getSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getSubject = getSubject;
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = updateSubjectSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs",
                errors: result.error.format(),
            });
        }
        const { facultyId } = result.data;
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid subject ID"
            });
            return;
        }
        const subjectExists = yield prisma.subject.findUnique({ where: { id } });
        if (!subjectExists) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        if (facultyId !== undefined) {
            const faculty = yield prisma.user.findUnique({
                where: { id: facultyId },
            });
            if (!faculty || faculty.role !== "Faculty") {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or unauthorized faculty ID",
                });
            }
        }
        const updatedSubject = yield prisma.subject.update({
            where: { id: id },
            data: result.data,
            include: {
                semester: true,
                faculty: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.json({
            success: true,
            message: "Subject updated successfully",
            data: updatedSubject
        });
    }
    catch (error) {
        console.error("Error in updateSubject:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject ID"
            });
        }
        const subjectExists = yield prisma.subject.findUnique({
            where: { id },
            include: {
                units: true,
                exams: true,
                coAttainments: true
            }
        });
        if (!subjectExists) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }
        // Delete all related records in a transaction
        yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete CO_Attainments
            yield prisma.cO_Attainment.deleteMany({
                where: { subjectId: id }
            });
            // Delete all questions related to the subject's exams
            for (const exam of subjectExists.exams) {
                yield prisma.question.deleteMany({
                    where: { examId: exam.id }
                });
            }
            // Delete all exams
            yield prisma.exam.deleteMany({
                where: { subjectId: id }
            });
            // Delete all CO_PO_Mappings related to the subject's units
            for (const unit of subjectExists.units) {
                yield prisma.cO_PO_Mapping.deleteMany({
                    where: { coId: unit.id }
                });
            }
            // Delete all units
            yield prisma.unit.deleteMany({
                where: { subjectId: id }
            });
            // Finally, delete the subject
            yield prisma.subject.delete({
                where: { id }
            });
        }));
        return res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteSubject:", error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                return res.status(400).json({
                    success: false,
                    message: "Cannot delete subject with existing references"
                });
            }
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.deleteSubject = deleteSubject;
