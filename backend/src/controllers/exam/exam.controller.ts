import { Request, Response } from 'express';
import { PrismaClient, ExamType } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const createExamSchema = zod.object({
  examType: zod.nativeEnum(ExamType),
  subjectId: zod.number().int().positive(),
  questions: zod.array(
    zod.object({
      text: zod.string(),
      marksAllocated: zod.number().positive(),
      unitId: zod.number().int().positive(),
    })
  ),
});

const updateExamSchema = zod.object({
  examType: zod.nativeEnum(ExamType),
  subjectId: zod.number().int().positive(),
  questions: zod.array(
    zod.object({
      id: zod.number().optional(),
      text: zod.string(),
      marksAllocated: zod.number().positive(),
      unitId: zod.number().int().positive(),
    })
  ),
});
  
// Get all exams with course information
export const getExams = async (req: Request, res: Response): Promise<any> => {
  try {
    const exams = await prisma.exam.findMany({
        include: {
          subject: {
            include: {
              semester: {
                include: {
                  course: true
                }
              }
            }
          },
          questions: {
            include: {
              unit: true,
              marks: true
            }
          },
        },
      });
      res.json({ success: true, data: exams });
  } catch (error) {
    console.error("Error in getExams controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getExamsBySubject = async (req: Request, res: Response): Promise<any> => {
    const { subjectId } = req.params;
    try {
      const subject = await prisma.subject.findUnique({
        where: { id: Number(subjectId) }
      });
  
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found"
        });
      }
  
      const exams = await prisma.exam.findMany({
        where: {
          subjectId: Number(subjectId),
        },
        include: {
          subject: {
            include: {
              semester: {
                include: {
                  course: true
                }
              }
            }
          },
          questions: {
            include: {
              unit: true,
              marks: true
            }
          },
          marks: true
        },
      });
      
      return res.json({
        success: true,
        data: exams,
        message: exams.length === 0 ? "No exams found for this subject" : undefined
      });
    } catch (error) {
      console.error("Error in getExamsBySubject controller:", (error as Error).message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// export const getExamsByCourseAndSemester = async (req: Request, res: Response): Promise<any> => {
//   const { courseId, semesterId } = req.params;

//   try {
//     if (!courseId || !semesterId) {
//       return res.status(400).json({
//         success: false,
//         message: "courseId and semesterId are required",
//       });
//     }

//     const exams = await prisma.exam.findMany({
//       where: {
//         semester: {
//           id: Number(semesterId),
//           courseId: Number(courseId),
//         },
//       },
//       include: {
//         semester: {
//           include: {
//             course: true,
//           },
//         },
//         subject: true, 
//         questions: true, 
//       },
//     });

//     if (exams.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No exams found for the given course and semester",
//       });
//     }

//     res.json({ success: true, exams });
//   } catch (error) {
//     console.error("Error in getExamsByCourseAndSemester controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// Get a specific exam by ID with course information




export const getExamById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const exam = await prisma.exam.findUnique({
        where: { id: Number(id) },
        include: {
          subject: {
            include: {
              semester: {
                include: {
                  course: true
                }
              }
            }
          },
          questions: {
            include: {
              unit: true,
              marks: true
            }
          },
        },
      });
      
      if (!exam) {
        return res.status(404).json({ success: false, message: "Exam not found" });
      }
      
      return res.json({ success: true, data: exam });
    } catch (error) {
      console.error("Error in getExamById controller:", (error as Error).message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const createExam = async (req: Request, res: Response): Promise<any> => {
    const { examType, subjectId, questions } = req.body;
  
    try {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: { semester: true },
      });
  
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }
  
      const { semesterId } = subject;
  
      const semester = await prisma.semester.findUnique({
        where: { id: semesterId },
      });
  
      if (!semester) {
        return res.status(404).json({
          success: false,
          message: "Semester not found.",
        });
      }
  
      const existingExam = await prisma.exam.findFirst({
        where: {
          examType,
          subjectId,
        },
      });
  
      if (existingExam) {
        return res.status(400).json({
          success: false,
          message: "An exam with this type already exists for this subject.",
        });
      }
  
      for (const q of questions) {
        const unit = await prisma.unit.findFirst({
          where: { id: q.unitId, subjectId },
        });
  
        if (!unit) {
          return res.status(400).json({
            success: false,
            message: `Unit with ID ${q.unitId} not found or does not belong to the specified subject.`,
          });
        }
      }
  
      const newExam = await prisma.$transaction(async (tx) => {
        const createdExam = await tx.exam.create({
          data: {
            examType,
            subjectId,
            questions: {
              create: questions.map((q: { text: string; marksAllocated: number; unitId: number }) => ({
                questionText: q.text,
                marksAllocated: q.marksAllocated,
                unitId: q.unitId,
              })),
            },
          },
          include: {
            subject: true,
            questions: true,
          },
        });
  
        return createdExam;
      });
  
      res.status(201).json({
        success: true,
        message: "Exam created successfully.",
        data: newExam,
      });
    } catch (error) {
      console.error("Error in createExam controller:", (error as Error).message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateExam = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { examType, subjectId, questions } = req.body;
  
    try {
      const existingExam = await prisma.exam.findUnique({
        where: { id: Number(id) },
        include: { questions: true }
      });
  
      if (!existingExam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found"
        });
      }
  
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: { semester: true }
      });
  
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }
  
      for (const q of questions) {
        if (!q.id) { 
          const unit = await prisma.unit.findUnique({
            where: { 
              id: q.unitId,
              subjectId: subjectId 
            },
          });
  
          if (!unit) {
            return res.status(400).json({
              success: false,
              message: `Unit with ID ${q.unitId} not found or does not belong to the specified subject.`,
            });
          }
        }
      }
  
      const duplicateExam = await prisma.exam.findFirst({
        where: {
          examType,
          subjectId,
          NOT: {
            id: Number(id) 
          }
        },
      });
  
      if (duplicateExam) {
        return res.status(400).json({
          success: false,
          message: "An exam with the same type already exists for this subject.",
        });
      }
  
      const existingQuestions = questions.filter((q: any) => q.id);
      const newQuestions = questions.filter((q: any) => !q.id);
  
      const updatedExam = await prisma.exam.update({
        where: { id: Number(id) },
        data: {
          examType,
          subjectId,
          questions: {
            update: existingQuestions.map((q: any) => ({
              where: { id: q.id },
              data: {
                questionText: q.text,
                marksAllocated: q.marksAllocated,
                unitId: q.unitId,
              }
            })),
            create: newQuestions.map((q: any) => ({
              questionText: q.text,
              marksAllocated: q.marksAllocated,
              unitId: q.unitId,
            }))
          }
        },
        include: {
          subject: {
            include: {
              semester: true 
            }
          },
          questions: true,
        },
      });
  
      res.json({
        success: true,
        data: updatedExam
      });
    } catch (error) {
      console.error("Error in updateExam controller:", (error as Error).message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete an exam and related questions
export const deleteExam = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
  
    try {
      const examId = Number(id);
  
      const existingExam = await prisma.exam.findUnique({
        where: { id: examId },
      });
  
      if (!existingExam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found.",
        });
      }
  
      await prisma.$transaction([
        prisma.marks.deleteMany({
          where: { examId },
        }),
        prisma.question.deleteMany({
          where: { examId },
        }),
        prisma.exam.delete({
          where: { id: examId },
        }),
      ]);
  
      res.status(200).json({ success: true, message: "Exam deleted successfully." });
    } catch (error) {
      console.error("Error in deleteExam controller:", (error as Error).message);
  
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error. Unable to delete exam." 
      });
    }
};
  
