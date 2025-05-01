// controllers/studentController.ts

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const getStudentDetails = async (req: any, res: any) => {
  try {
    const userId = req.user.id; 

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            batch: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const enrollment = student.enrollments[0]; 

    const studentDetails = {
      name: student.name,
      email: student.email,
      rollNo: enrollment?.rollNo || null,
      batchYear: enrollment?.batch?.batchYear || null,
      courseName: enrollment?.batch?.course.courseName || null,
      profileDetails: student.profileDetails || {},
    };

    return res.status(200).json(studentDetails);
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


const getStudentMarksSchema = z.object({
  semester: z.number().min(1, "Semester must be at least 1").max(12, "Semester can't be more than 12"),
});

export const getStudentMarksBySemester = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const parseResult = getStudentMarksSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.flatten() });
    }
    const { semester } = parseResult.data;

    // Find the student's enrollment first
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: userId, isActive: true },
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    // Find the subjects for this batch and semester
    const subjects = await prisma.courseSubject.findMany({
      where: {
        batchId: enrollment.batchId,
        semester: semester,
      },
      include: {
        subject: true,
      },
    });
    if (subjects.length === 0) {
      return res.status(404).json({ message: "No subjects found for this semester." });
    }

    const subjectIds = subjects.map((cs) => cs.subjectId);

    // Fetch Standard Exam Marks with question details
    const standardMarks = await prisma.standardExamMarks.findMany({
      where: {
        studentId: userId,
        subjectId: { in: subjectIds },
      },
      include: {
        exam: true,
        subject: true,
        questionMarks: {
          include: {
            question: {
              include: {
                unit: true,  // Include unit information
              },
            },
          },
        },
      },
    });

    // Fetch Internal Assessment Marks
    const internalMarks = await prisma.internalAssessmentMarks.findMany({
      where: {
        studentId: userId,
        subjectId: { in: subjectIds },
      },
      include: {
        exam: true,
        subject: true,
      },
    });

    // Define interfaces for proper typing
    interface QuestionMarkData {
      questionId: number;
      questionText: string;
      unitNumber: number;
      marksAllocated: number;
      marksObtained: number;
    }

    interface ExamData {
      examType: string;
      totalMarks?: number;
      marksObtained?: number;
      questionWiseMarks?: QuestionMarkData[];
    }

    interface SubjectMarksData {
      standardExams: ExamData[];
      internalAssessments: ExamData[];
    }

    // Initialize properly typed marksData object
    const marksData: Record<string, SubjectMarksData> = {};

    // Organizing the marks subject-wise
    for (const subject of subjects) {
      const subjectStandardMarks = standardMarks.filter(m => m.subjectId === subject.subjectId);
      const subjectInternalMarks = internalMarks.filter(m => m.subjectId === subject.subjectId);
      
      marksData[subject.subject.subjectName] = {
        standardExams: subjectStandardMarks.map(m => ({
          examType: m.exam.examType,
          totalMarks: m.totalMarks,
          questionWiseMarks: m.questionMarks.map(qm => ({
            questionId: qm.question.id,
            questionText: qm.question.questionText,
            unitNumber: qm.question.unit.unitNumber,
            marksAllocated: qm.question.marksAllocated,
            marksObtained: qm.marksObtained,
          })),
        })),
        internalAssessments: subjectInternalMarks.map(m => ({
          examType: m.exam.examType,
          marksObtained: m.marksObtained,
        })),
      };
    }

    return res.status(200).json(marksData);
  } catch (error) {
    console.error("Error fetching marks:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};