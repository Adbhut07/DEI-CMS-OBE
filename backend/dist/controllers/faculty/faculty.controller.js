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
exports.getAssignedSubjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAssignedSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const facultyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!facultyId) {
        return res
            .status(400)
            .json({ success: false, message: "User is not authenticated" });
    }
    try {
        // Check if the faculty exists
        const faculty = yield prisma.user.findUnique({
            where: { id: Number(facultyId) },
            include: {
                facultySubjects: {
                    include: {
                        course: true,
                        subject: true,
                        batch: true,
                    },
                },
            },
        });
        if (!faculty) {
            return res
                .status(404)
                .json({ success: false, message: "Faculty not found" });
        }
        const assignedSubjects = faculty.facultySubjects.map((assignment) => ({
            id: assignment.id,
            subject: {
                id: assignment.subject.id,
                name: assignment.subject.subjectName,
                code: assignment.subject.subjectCode,
            },
            course: {
                id: assignment.course.id,
                name: assignment.course.courseName,
            },
            batch: {
                id: assignment.batch.id,
                year: assignment.batch.batchYear,
            },
            semester: assignment.semester,
        }));
        res.json({
            success: true,
            data: assignedSubjects,
        });
    }
    catch (error) {
        console.error("Error in getAssignedSubjects controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAssignedSubjects = getAssignedSubjects;
