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
exports.getCOAttainment = exports.calculateCOAttainment = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const coAttainmentSchema = zod_1.default.object({
    batchId: zod_1.default.number().int().positive("Batch ID must be a positive integer"),
    courseId: zod_1.default.number().int().positive("Course ID must be a positive integer"),
});
const calculateCOAttainment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = coAttainmentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.format(),
            });
        }
        const { batchId, courseId } = req.body;
        // First, verify the batch and course exist
        const batch = yield prisma.batch.findUnique({
            where: { id: batchId },
        });
        const course = yield prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!batch || !course) {
            return res.status(404).json({
                success: false,
                message: "Batch or Course not found",
            });
        }
        // Get all course subjects for this course and batch
        const courseSubjects = yield prisma.courseSubject.findMany({
            where: {
                courseId: courseId,
                batchId: batchId,
            },
            include: {
                subject: true,
            },
        });
        if (courseSubjects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subjects found for this course and batch",
            });
        }
        const subjectIds = courseSubjects.map(cs => cs.subjectId);
        // Process each subject
        const allResults = [];
        for (const courseSubject of courseSubjects) {
            const subjectId = courseSubject.subjectId;
            // Get all units (COs) for this subject
            const units = yield prisma.unit.findMany({
                where: {
                    subjectId: subjectId,
                },
                orderBy: {
                    unitNumber: 'asc',
                },
            });
            if (units.length === 0) {
                continue; // Skip subjects with no units
            }
            // Get all students enrolled in this batch
            const enrollments = yield prisma.enrollment.findMany({
                where: {
                    batchId: batchId,
                    isActive: true,
                },
            });
            if (enrollments.length === 0) {
                continue; // Skip if no active students
            }
            const studentIds = enrollments.map(e => e.studentId);
            const totalStudents = studentIds.length;
            // Get all exams for this subject
            const exams = yield prisma.exam.findMany({
                where: {
                    subjectId: subjectId,
                },
            });
            // Categorize exams - Fix the TypeScript error by using array of standard exam types
            const standardExamTypes = [client_1.ExamType.CT1, client_1.ExamType.CT2, client_1.ExamType.CA, client_1.ExamType.ESE];
            const internalExamTypes = [client_1.ExamType.DHA, client_1.ExamType.AA, client_1.ExamType.ATT];
            const standardExams = exams.filter(exam => standardExamTypes.includes(exam.examType));
            const internalExams = exams.filter(exam => internalExamTypes.includes(exam.examType));
            // Get all questions for standard exams
            const standardExamIds = standardExams.map(exam => exam.id);
            // Get all questions linked to units for this subject
            const questionsByUnit = yield Promise.all(units.map((unit) => __awaiter(void 0, void 0, void 0, function* () {
                const questions = yield prisma.question.findMany({
                    where: {
                        unitId: unit.id,
                        examId: { in: standardExamIds },
                    },
                    include: {
                        exam: true,
                    },
                });
                return { unitId: unit.id, questions };
            })));
            // Get standard exam marks for all students
            const standardExamMarks = yield prisma.standardExamMarks.findMany({
                where: {
                    studentId: { in: studentIds },
                    subjectId: subjectId,
                    examId: { in: standardExamIds },
                },
                include: {
                    questionMarks: {
                        include: {
                            question: true,
                        },
                    },
                    exam: true,
                },
            });
            // Get internal assessment marks for all students
            const internalExamIds = internalExams.map(exam => exam.id);
            const internalAssessmentMarks = yield prisma.internalAssessmentMarks.findMany({
                where: {
                    studentId: { in: studentIds },
                    subjectId: subjectId,
                    examId: { in: internalExamIds },
                },
                include: {
                    exam: true,
                },
            });
            // Calculate attainment for each unit (CO)
            const unitResults = [];
            for (const unit of units) {
                // Find questions for this unit
                const unitQuestions = ((_a = questionsByUnit.find(q => q.unitId === unit.id)) === null || _a === void 0 ? void 0 : _a.questions) || [];
                const unitQuestionIds = unitQuestions.map(q => q.id);
                // Initialize student scores
                const studentScores = {};
                studentIds.forEach(id => {
                    studentScores[id] = { obtained: 0, total: 0 };
                });
                // Calculate standard exam marks (CT1, CT2, CA, ESE) - Question specific marks
                for (const studentId of studentIds) {
                    // Get standard exam marks for this student
                    const studentStandardMarks = standardExamMarks.filter(mark => mark.studentId === studentId);
                    for (const examMark of studentStandardMarks) {
                        // Add marks for questions in this unit
                        for (const questionMark of examMark.questionMarks) {
                            if (unitQuestionIds.includes(questionMark.questionId)) {
                                studentScores[studentId].obtained += questionMark.marksObtained;
                                studentScores[studentId].total += questionMark.question.marksAllocated;
                            }
                        }
                    }
                    // Get internal assessment marks (DHA, AA, ATT) for this student
                    const studentInternalMarks = internalAssessmentMarks.filter(mark => mark.studentId === studentId);
                    // Distribute internal marks equally across all units
                    for (const internalMark of studentInternalMarks) {
                        // Find the exam details
                        const exam = internalExams.find(e => e.id === internalMark.examId);
                        if (!exam || !exam.marksAllocated)
                            continue;
                        // Divide marks equally among all units
                        const marksPerUnit = internalMark.marksObtained / units.length;
                        const totalMarksPerUnit = exam.marksAllocated / units.length;
                        // Add to student score
                        studentScores[studentId].obtained += marksPerUnit;
                        studentScores[studentId].total += totalMarksPerUnit;
                    }
                }
                // Calculate percentages for each student for this CO
                const studentPercentages = Object.entries(studentScores).map(([_, scores]) => {
                    // Only calculate percentage if the student attempted something
                    if (scores.total > 0) {
                        return (scores.obtained / scores.total) * 100;
                    }
                    return 0;
                });
                // Count students in each category according to the rubric
                const studentsAbove80 = studentPercentages.filter(p => p >= 80).length;
                const studentsBetween50And80 = studentPercentages.filter(p => p >= 50 && p < 80).length;
                const studentsBetween30And50 = studentPercentages.filter(p => p >= 30 && p < 50).length;
                const studentsBelow30 = studentPercentages.filter(p => p < 30).length;
                // Calculate attainment level based on rubric
                let attainmentLevel = 0;
                if ((studentsAbove80 / totalStudents) * 100 > 50) {
                    attainmentLevel = 3;
                }
                else if ((studentsBetween50And80 / totalStudents) * 100 > 50) {
                    attainmentLevel = 2;
                }
                else if ((studentsBetween30And50 / totalStudents) * 100 > 50) {
                    attainmentLevel = 1;
                }
                // Update unit attainment
                yield prisma.unit.update({
                    where: { id: unit.id },
                    data: { attainment: attainmentLevel },
                });
                // Create or update CO_Attainment record
                yield prisma.cO_Attainment.upsert({
                    where: {
                        coId_batchId_subjectId: {
                            coId: unit.id,
                            batchId: batchId,
                            subjectId: subjectId,
                        },
                    },
                    update: {
                        attainment: attainmentLevel,
                    },
                    create: {
                        coId: unit.id,
                        batchId: batchId,
                        subjectId: subjectId,
                        attainment: attainmentLevel,
                    },
                });
                // Add to results
                unitResults.push({
                    unitId: unit.id,
                    unitNumber: unit.unitNumber,
                    description: unit.description,
                    attainmentLevel,
                    studentPerformance: {
                        totalStudents,
                        studentsAbove80Percent: studentsAbove80,
                        studentsBetween50And80Percent: studentsBetween50And80,
                        studentsBetween30And50Percent: studentsBetween30And50,
                        studentsBelow30Percent: studentsBelow30,
                    },
                    statistics: {
                        averageScore: studentPercentages.reduce((sum, score) => sum + score, 0) / totalStudents,
                        highestScore: Math.max(...studentPercentages),
                        lowestScore: Math.min(...studentPercentages),
                    }
                });
            }
            // Add subject results to overall results
            allResults.push({
                subjectId: subjectId,
                subjectName: courseSubject.subject.subjectName,
                subjectCode: courseSubject.subject.subjectCode,
                unitResults
            });
        }
        return res.status(200).json({
            success: true,
            message: "CO attainment calculated successfully",
            courseId,
            batchId,
            courseName: course.courseName,
            results: allResults,
        });
    }
    catch (error) {
        console.error("Error calculating CO attainment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.calculateCOAttainment = calculateCOAttainment;
// Get CO attainment for a specific batch and course
const getCOAttainment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { batchId, courseId } = req.params;
        // Get course details
        const course = yield prisma.course.findUnique({
            where: { id: Number(courseId) },
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        // Get all course subjects for this course and batch
        const courseSubjects = yield prisma.courseSubject.findMany({
            where: {
                courseId: Number(courseId),
                batchId: Number(batchId),
            },
            include: {
                subject: true,
            },
        });
        if (courseSubjects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subjects found for this course and batch",
            });
        }
        const subjectIds = courseSubjects.map(cs => cs.subjectId);
        // Get all CO attainments for this batch and subjects
        const coAttainments = yield prisma.cO_Attainment.findMany({
            where: {
                batchId: Number(batchId),
                subjectId: { in: subjectIds },
            },
            include: {
                co: {
                    select: {
                        id: true,
                        unitNumber: true,
                        description: true,
                        subject: {
                            select: {
                                id: true,
                                subjectName: true,
                                subjectCode: true
                            }
                        }
                    }
                },
                subject: true,
                batch: true
            },
            orderBy: [
                { subject: { subjectName: 'asc' } },
                { co: { unitNumber: 'asc' } },
            ],
        });
        // Group by subject
        const groupedBySubject = coAttainments.reduce((acc, curr) => {
            const subjectId = curr.subjectId;
            if (!acc[subjectId]) {
                acc[subjectId] = {
                    subjectId,
                    subjectName: curr.subject.subjectName,
                    subjectCode: curr.subject.subjectCode,
                    units: []
                };
            }
            acc[subjectId].units.push({
                unitId: curr.coId,
                unitNumber: curr.co.unitNumber,
                description: curr.co.description,
                attainment: curr.attainment
            });
            return acc;
        }, {});
        return res.status(200).json({
            success: true,
            courseId: Number(courseId),
            courseName: course.courseName,
            batchId: Number(batchId),
            subjects: Object.values(groupedBySubject)
        });
    }
    catch (error) {
        console.error("Error fetching CO attainment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.getCOAttainment = getCOAttainment;
