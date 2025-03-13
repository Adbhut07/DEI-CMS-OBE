import { Request, Response } from 'express';
import { PrismaClient, ExamType } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const EXAM_TYPES_WITH_QUESTIONS: readonly ExamType[] = [
  ExamType.CT1,
  ExamType.CT2,
  ExamType.ESE
] as const;

const INTERNAL_ASSESSMENT_TYPES: readonly ExamType[] = [
  ExamType.DHA,
  ExamType.CA,
  ExamType.AA,
  ExamType.ATT
] as const;

const regularQuestionSchema = zod.array(
  zod.object({
    text: zod.string(),
    marksAllocated: zod.number().positive(),
    unitId: zod.number().int().positive(),
  })
);

// Schema for internal assessment exams
const internalAssessmentSchema = zod.object({
  totalMarks: zod.number().positive()
});

const createExamSchema = zod.object({
  examType: zod.nativeEnum(ExamType),
  subjectId: zod.number().int().positive(),
  questions: zod.union([regularQuestionSchema, internalAssessmentSchema])
});

  
// Get all exams with course information
export const getExams = async (req: Request, res: Response): Promise<any> => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        subject: {
          include: {
            courseMappings: {
              include: {
                course: true,
                batch: true
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
            courseMappings: {
              include: {
                course: true,
                batch: true
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


//************************** */

export const getOnlyExamsBySubject = async (req: Request, res: Response): Promise<any> => {
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
        // subject: {
        //   include: {
        //     courseMappings: {
        //       include: {
        //         course: true,
        //         batch: true
        //       }
        //     }
        //   }
        // },
        questions: true,
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

export const getExamById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(id) },
      include: {
        subject: {
          include: {
            courseMappings: {
              include: {
                course: true,
                batch: true
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
    const validationResult = createExamSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validationResult.error.errors
      });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { 
        courseMappings: true,
        units: {
          orderBy: {
            unitNumber: 'asc'
          }
        }
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    if (subject.courseMappings.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subject is not mapped to any course.",
      });
    }

    if (subject.units.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subject has no units defined.",
      });
    }

    const existingExam = await prisma.exam.findFirst({
      where: { examType, subjectId },
    });

    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: "An exam with this type already exists for this subject.",
      });
    }

    let questionsToCreate;

    if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
      // For CT1, CT2, ESE - validate and use regular questions
      for (const q of questions) {
        const unit = subject.units.find(u => u.id === q.unitId);
        if (!unit) {
          return res.status(400).json({
            success: false,
            message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
          });
        }
      }
      questionsToCreate = questions.map((q: { text: string; marksAllocated: number; unitId: number }) => ({
        questionText: q.text,
        marksAllocated: q.marksAllocated,
        unitId: q.unitId,
      }));
    } else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
      // For internal assessments - create equal distribution across units
      const totalMarks = questions.totalMarks;
      const numUnits = subject.units.length;
      const marksPerUnit = Math.floor(totalMarks / numUnits);
      const remainingMarks = totalMarks % numUnits;

      questionsToCreate = subject.units.map((unit, index) => ({
        questionText: `${examType} assessment for Unit ${unit.unitNumber}`,
        // Add extra mark to first few units if there are remaining marks
        marksAllocated: marksPerUnit + (index < remainingMarks ? 1 : 0),
        unitId: unit.id,
      }));
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid exam type",
      });
    }

    const newExam = await prisma.exam.create({
      data: {
        examType,
        subjectId,
        questions: {
          create: questionsToCreate,
        },
      },
      include: {
        subject: {
          include: {
            courseMappings: {
              include: {
                course: true,
                batch: true
              }
            }
          }
        },
        questions: {
          include: {
            unit: true
          }
        },
      },
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
      include: { 
        questions: true,
        subject: {
          include: {
            units: {
              orderBy: {
                unitNumber: 'asc'
              }
            }
          }
        }
      }
    });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    // If exam type is changing between regular and internal, verify it's allowed
    if (existingExam.examType !== examType) {
      const wasRegular = EXAM_TYPES_WITH_QUESTIONS.includes(existingExam.examType);
      const willBeRegular = EXAM_TYPES_WITH_QUESTIONS.includes(examType);
      
      if (wasRegular !== willBeRegular) {
        return res.status(400).json({
          success: false,
          message: "Cannot change between regular and internal assessment exam types"
        });
      }
    }

    let questionsToUpdate: any;     //will change later

    if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
      // Handle regular questions update
      const existingQuestions = questions.filter((q: any) => q.id);
      const newQuestions = questions.filter((q: any) => !q.id);
      
      // Validate all units belong to subject
      for (const q of [...existingQuestions, ...newQuestions]) {
        const unit = existingExam.subject.units.find(u => u.id === q.unitId);
        if (!unit) {
          return res.status(400).json({
            success: false,
            message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
          });
        }
      }

      questionsToUpdate = {
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
      };
    } else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
      // Update internal assessment marks distribution
      const totalMarks = questions.totalMarks;
      const numUnits = existingExam.subject.units.length;
      const marksPerUnit = Math.floor(totalMarks / numUnits);
      const remainingMarks = totalMarks % numUnits;

      // Create update operations for existing questions or create new ones if needed
      questionsToUpdate = {
        deleteMany: {
          examId: Number(id)
        },
        create: existingExam.subject.units.map((unit, index) => ({
          questionText: `${examType} assessment for Unit ${unit.unitNumber}`,
          marksAllocated: marksPerUnit + (index < remainingMarks ? 1 : 0),
          unitId: unit.id,
        }))
      };
    }

    const updatedExam = await prisma.$transaction(async (tx) => {
      // Delete related marks if they exist
      await tx.marks.deleteMany({
        where: { examId: Number(id) }
      });

      return tx.exam.update({
        where: { id: Number(id) },
        data: {
          examType,
          subjectId,
          questions: questionsToUpdate
        },
        include: {
          subject: {
            include: {
              courseMappings: {
                include: {
                  course: true,
                  batch: true
                }
              }
            }
          },
          questions: {
            include: {
              unit: true
            }
          },
        },
      });
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