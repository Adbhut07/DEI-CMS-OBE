// import { Request, Response } from 'express';
// import { PrismaClient, ExamType } from '@prisma/client';
// import zod from 'zod';

// const prisma = new PrismaClient();

// const EXAM_TYPES_WITH_QUESTIONS: readonly ExamType[] = [
//   ExamType.CT1,
//   ExamType.CT2,
//   ExamType.CA,
//   ExamType.ESE
// ] as const;

// const INTERNAL_ASSESSMENT_TYPES: readonly ExamType[] = [
//   ExamType.DHA,
//   ExamType.AA,
//   ExamType.ATT
// ] as const;

// // Exam type-specific marks allocation
// const EXAM_MARKS_ALLOCATION: Record<ExamType, number> = {
//   CT1: 40,
//   CT2: 40,
//   CA: 40,
//   ESE: 50,
//   DHA: 40,
//   AA: 20,
//   ATT: 10, // or 20 (based on subject, can be dynamic)
// };

// const createExamSchema = zod.object({
//   examType: zod.nativeEnum(ExamType),
//   subjectId: zod.number().int().positive(),
//   marksAllocated: zod.number().positive(), // ✅ Added validation
//   questions: zod.array(
//     zod.object({
//       text: zod.string(),
//       marksAllocated: zod.number().positive(),
//       unitId: zod.number().int().positive(),
//     })
//   ).optional(),
// });
  

// export const getExams = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const exams = await prisma.exam.findMany({
//       include: {
//         subject: {
//           include: {
//             courseMappings: {
//               include: {
//                 course: true,
//                 batch: true,
//               },
//             },
//           },
//         },
//         questions: {
//           include: {
//             unit: true,
//           },
//         },
//       },
//     });

//     // Filter out questions for internal assessment exams (DHA, AA, ATT)
//     const filteredExams = exams.map(exam => ({
//       ...exam,
//       questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
//     }));

//     res.json({ success: true, data: filteredExams });
//   } catch (error) {
//     console.error("Error in getExams controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// export const getExamsBySubject = async (req: Request, res: Response): Promise<any> => {
//   const { subjectId } = req.params;
  
//   try {
//     const subject = await prisma.subject.findUnique({
//       where: { id: Number(subjectId) }
//     });

//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found"
//       });
//     }

//     const exams = await prisma.exam.findMany({
//       where: {
//         subjectId: Number(subjectId),
//       },
//       include: {
//         subject: {
//           include: {
//             courseMappings: {
//               include: {
//                 course: true,
//                 batch: true
//               }
//             }
//           }
//         },
//         questions: {
//           include: {
//             unit: true,
//           }
//         },
//         marks: true
//       },
//     });

//     // Filter out questions for internal assessment exams (DHA, AA, ATT)
//     const filteredExams = exams.map(exam => ({
//       ...exam,
//       questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
//     }));

//     return res.json({
//       success: true,
//       data: filteredExams,
//       message: exams.length === 0 ? "No exams found for this subject" : undefined
//     });
//   } catch (error) {
//     console.error("Error in getExamsBySubject controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getOnlyExamsBySubject = async (req: Request, res: Response): Promise<any> => {
//   const { subjectId } = req.params;

//   try {
//     const subject = await prisma.subject.findUnique({
//       where: { id: Number(subjectId) }
//     });

//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found"
//       });
//     }

//     const exams = await prisma.exam.findMany({
//       where: {
//         subjectId: Number(subjectId),
//       },
//       include: {
//         questions: true,
//       },
//     });

//     // Remove questions for internal assessment exams (DHA, AA, ATT)
//     const filteredExams = exams.map(exam => ({
//       ...exam,
//       questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
//     }));

//     return res.json({
//       success: true,
//       data: filteredExams,
//       message: filteredExams.length === 0 ? "No exams found for this subject" : undefined
//     });
//   } catch (error) {
//     console.error("Error in getOnlyExamsBySubject controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// export const getExamById = async (req: Request, res: Response): Promise<any> => {
//   const { id } = req.params;

//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: Number(id) },
//       include: {
//         subject: {
//           include: {
//             courseMappings: {
//               include: {
//                 course: true,
//                 batch: true
//               }
//             }
//           }
//         },
//         questions: {
//           include: {
//             unit: true,
//             marks: true
//           }
//         },
//       },
//     });

//     if (!exam) {
//       return res.status(404).json({ success: false, message: "Exam not found" });
//     }

//     // Remove questions for internal assessment exams (DHA, AA, ATT)
//     const filteredExam = {
//       ...exam,
//       questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
//     };

//     return res.json({ success: true, data: filteredExam });
//   } catch (error) {
//     console.error("Error in getExamById controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



// export const createExam = async (req: Request, res: Response): Promise<any> => {
//   const { examType, subjectId, marksAllocated, questions }: { examType: ExamType; subjectId: number; marksAllocated: number; questions: any[] } = req.body;

//   try {
//     const validationResult = createExamSchema.safeParse(req.body);
//     if (!validationResult.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid request data",
//         errors: validationResult.error.errors
//       });
//     }

//     const subject = await prisma.subject.findUnique({
//       where: { id: subjectId },
//       include: { 
//         courseMappings: true,
//         units: { orderBy: { unitNumber: 'asc' } }
//       },
//     });

//     if (!subject) {
//       return res.status(404).json({ success: false, message: "Subject not found." });
//     }

//     if (subject.courseMappings.length === 0) {
//       return res.status(400).json({ success: false, message: "Subject is not mapped to any course." });
//     }

//     if (subject.units.length === 0) {
//       return res.status(400).json({ success: false, message: "Subject has no units defined." });
//     }

//     const existingExam = await prisma.exam.findFirst({
//       where: { examType, subjectId },
//     });

//     if (existingExam) {
//       return res.status(400).json({ success: false, message: "An exam with this type already exists for this subject." });
//     }

//     // ✅ Validate marks allocation based on exam type
//     if (marksAllocated !== EXAM_MARKS_ALLOCATION[examType]) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid marks allocation for ${examType}. Expected: ${EXAM_MARKS_ALLOCATION[examType]}`,
//       });
//     }

//     let newExam;

//     if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
//       // ✅ CT1, CT2, CA, ESE exams require questions
//       if (!questions || !Array.isArray(questions)) {
//         return res.status(400).json({
//           success: false,
//           message: "Questions are required for this exam type.",
//         });
//       }

//       for (const q of questions) {
//         const unit = subject.units.find(u => u.id === q.unitId);
//         if (!unit) {
//           return res.status(400).json({
//             success: false,
//             message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
//           });
//         }
//       }

//       newExam = await prisma.exam.create({
//         data: {
//           examType,
//           subjectId,
//           marksAllocated, // ✅ Store marks allocation
//           questions: {
//             create: questions.map(q => ({
//               questionText: q.text,
//               marksAllocated: q.marksAllocated,
//               unitId: q.unitId,
//             }))
//           },
//         },
//         include: { questions: true }
//       });

//     } else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
//       // ✅ DHA, AA, ATT exams do NOT require questions
//       newExam = await prisma.exam.create({
//         data: {
//           examType,
//           subjectId,
//           marksAllocated, // ✅ Store marks allocation
//         }
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid exam type",
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: "Exam created successfully.",
//       data: newExam,
//     });

//   } catch (error) {
//     console.error("Error in createExam controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// export const updateExam = async (req: Request, res: Response): Promise<any> => {
//   const { id } = req.params;
//   const { examType, subjectId, marksAllocated, questions } = req.body;

//   try {
//     const existingExam = await prisma.exam.findUnique({
//       where: { id: Number(id) },
//       include: { 
//         questions: true,
//         subject: {
//           include: {
//             units: {
//               orderBy: {
//                 unitNumber: 'asc'
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!existingExam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found"
//       });
//     }

//     // If changing exam type between regular and internal, ensure it's allowed
//     const wasRegular = EXAM_TYPES_WITH_QUESTIONS.includes(existingExam.examType);
//     const willBeRegular = EXAM_TYPES_WITH_QUESTIONS.includes(examType);
    
//     if (wasRegular !== willBeRegular) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot change between regular and internal assessment exam types"
//       });
//     }

//     let questionsToUpdate: any = {};  // Default empty object

//     if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
//       // ✅ Regular exams (CT1, CT2, CA, ESE) → Update or Create Questions
//       const existingQuestions = questions.filter((q: any) => q.id);
//       const newQuestions = questions.filter((q: any) => !q.id);
      
//       // Validate units
//       for (const q of [...existingQuestions, ...newQuestions]) {
//         const unit = existingExam.subject.units.find(u => u.id === q.unitId);
//         if (!unit) {
//           return res.status(400).json({
//             success: false,
//             message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
//           });
//         }
//       }

//       questionsToUpdate = {
//         deleteMany: {}, // Remove any existing questions if not part of the updated ones
//         create: newQuestions.map((q: any) => ({
//           questionText: q.text,
//           marksAllocated: q.marksAllocated,
//           unitId: q.unitId,
//         })),
//         update: existingQuestions.map((q: any) => ({
//           where: { id: q.id },
//           data: {
//             questionText: q.text,
//             marksAllocated: q.marksAllocated,
//             unitId: q.unitId,
//           }
//         }))
//       };
//     } else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
//       // ✅ Internal assessments (DHA, AA, ATT) → REMOVE QUESTIONS
//       questionsToUpdate = {
//         deleteMany: {} // Deletes all questions for internal assessments
//       };
//     }

//     const updatedExam = await prisma.$transaction(async (tx) => {
//       // Delete related marks if they exist
//       await tx.marks.deleteMany({
//         where: { examId: Number(id) }
//       });

//       return tx.exam.update({
//         where: { id: Number(id) },
//         data: {
//           examType,
//           subjectId,
//           marksAllocated,  // ✅ Updated field
//           questions: questionsToUpdate // Handles different logic for regular/internal
//         },
//         include: {
//           subject: {
//             include: {
//               courseMappings: {
//                 include: {
//                   course: true,
//                   batch: true
//                 }
//               }
//             }
//           },
//           questions: {
//             include: {
//               unit: true
//             }
//           },
//         },
//       });
//     });

//     res.json({
//       success: true,
//       message: "Exam updated successfully.",
//       data: updatedExam
//     });
//   } catch (error) {
//     console.error("Error in updateExam controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



// export const deleteExam = async (req: Request, res: Response): Promise<any> => {
//   const { id } = req.params;

//   try {
//     const examId = Number(id);

//     const existingExam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: { questions: true, marks: true } // Fetch related data
//     });

//     if (!existingExam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found.",
//       });
//     }

//     await prisma.$transaction(async (tx) => {
//       // Delete related marks (if any)
//       if (existingExam.marks.length > 0) {
//         await tx.marks.deleteMany({ where: { examId } });
//       }

//       // Delete related questions only for exams that use them (CT1, CT2, CA, ESE)
//       if (existingExam.questions.length > 0) {
//         await tx.question.deleteMany({ where: { examId } });
//       }

//       // Delete the exam itself
//       await tx.exam.delete({ where: { id: examId } });
//     });

//     res.status(200).json({ success: true, message: "Exam deleted successfully." });
//   } catch (error) {
//     console.error("Error in deleteExam controller:", (error as Error).message);

//     res.status(500).json({ 
//       success: false, 
//       message: "Internal Server Error. Unable to delete exam." 
//     });
//   }
// };


import { Request, Response } from 'express';
import { PrismaClient, ExamType } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const EXAM_TYPES_WITH_QUESTIONS: readonly ExamType[] = [
  ExamType.CT1,
  ExamType.CT2,
  ExamType.CA,
  ExamType.ESE
] as const;

const INTERNAL_ASSESSMENT_TYPES: readonly ExamType[] = [
  ExamType.DHA,
  ExamType.AA,
  ExamType.ATT
] as const;

// Exam type-specific marks allocation
const EXAM_MARKS_ALLOCATION: Record<ExamType, number> = {
  CT1: 40,
  CT2: 40,
  CA: 40,
  ESE: 50,
  DHA: 40,
  AA: 20,
  ATT: 10, // or 20 (based on subject, can be dynamic)
};

const createExamSchema = zod.object({
  examType: zod.nativeEnum(ExamType),
  subjectId: zod.number().int().positive(),
  marksAllocated: zod.number().positive(),
  questions: zod.array(
    zod.object({
      text: zod.string(),
      marksAllocated: zod.number().positive(),
      unitId: zod.number().int().positive(),
    })
  ).optional(),
});
  
export const getExams = async (req: Request, res: Response): Promise<any> => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        subject: {
          include: {
            courseMappings: {
              include: {
                course: true,
                batch: true,
              },
            },
          },
        },
        questions: {
          include: {
            unit: true,
          },
        },
      },
    });

    // Filter out questions for internal assessment exams (DHA, AA, ATT)
    const filteredExams = exams.map(exam => ({
      ...exam,
      questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
    }));

    res.json({ success: true, data: filteredExams });
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
          }
        },
        // standardMarks: true,
        // internalMarks: true
      },
    });

    // Filter out questions for internal assessment exams (DHA, AA, ATT)
    const filteredExams = exams.map(exam => ({
      ...exam,
      questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
    }));

    return res.json({
      success: true,
      data: filteredExams,
      message: exams.length === 0 ? "No exams found for this subject" : undefined
    });
  } catch (error) {
    console.error("Error in getExamsBySubject controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

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
        questions: true,
      },
    });

    // Remove questions for internal assessment exams (DHA, AA, ATT)
    const filteredExams = exams.map(exam => ({
      ...exam,
      questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
    }));

    return res.json({
      success: true,
      data: filteredExams,
      message: filteredExams.length === 0 ? "No exams found for this subject" : undefined
    });
  } catch (error) {
    console.error("Error in getOnlyExamsBySubject controller:", (error as Error).message);
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
        standardMarks: {
          include: {
            questionMarks: true
          }
        },
        internalMarks: true
      },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // Remove questions for internal assessment exams (DHA, AA, ATT)
    const filteredExam = {
      ...exam,
      questions: INTERNAL_ASSESSMENT_TYPES.includes(exam.examType) ? [] : exam.questions
    };

    return res.json({ success: true, data: filteredExam });
  } catch (error) {
    console.error("Error in getExamById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createExam = async (req: Request, res: Response): Promise<any> => {
  const { examType, subjectId, marksAllocated, questions }: { examType: ExamType; subjectId: number; marksAllocated: number; questions: any[] } = req.body;

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
        units: { orderBy: { unitNumber: 'asc' } }
      },
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    if (subject.courseMappings.length === 0) {
      return res.status(400).json({ success: false, message: "Subject is not mapped to any course." });
    }

    if (subject.units.length === 0) {
      return res.status(400).json({ success: false, message: "Subject has no units defined." });
    }

    const existingExam = await prisma.exam.findFirst({
      where: { examType, subjectId },
    });

    if (existingExam) {
      return res.status(400).json({ success: false, message: "An exam with this type already exists for this subject." });
    }

    // Validate marks allocation based on exam type
    if (marksAllocated !== EXAM_MARKS_ALLOCATION[examType]) {
      return res.status(400).json({
        success: false,
        message: `Invalid marks allocation for ${examType}. Expected: ${EXAM_MARKS_ALLOCATION[examType]}`,
      });
    }

    let newExam;

    if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
      // CT1, CT2, CA, ESE exams require questions
      if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({
          success: false,
          message: "Questions are required for this exam type.",
        });
      }

      for (const q of questions) {
        const unit = subject.units.find(u => u.id === q.unitId);
        if (!unit) {
          return res.status(400).json({
            success: false,
            message: `Unit with ID ${q.unitId} not found or does not belong to this subject.`,
          });
        }
      }

      newExam = await prisma.exam.create({
        data: {
          examType,
          subjectId,
          marksAllocated,
          questions: {
            create: questions.map(q => ({
              questionText: q.text,
              marksAllocated: q.marksAllocated,
              unitId: q.unitId,
            }))
          },
        },
        include: { questions: true }
      });

    } else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
      // DHA, AA, ATT exams do NOT require questions
      newExam = await prisma.exam.create({
        data: {
          examType,
          subjectId,
          marksAllocated,
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid exam type",
      });
    }

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
  const { examType, subjectId, marksAllocated, questions } = req.body;

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
        },
        standardMarks: {
          include: {
            questionMarks: true
          }
        },
        internalMarks: true
      }
    });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    // If changing exam type between regular and internal, ensure it's allowed
    const wasRegular = EXAM_TYPES_WITH_QUESTIONS.includes(existingExam.examType);
    const willBeRegular = EXAM_TYPES_WITH_QUESTIONS.includes(examType);
    
    if (wasRegular !== willBeRegular) {
      return res.status(400).json({
        success: false,
        message: "Cannot change between regular and internal assessment exam types"
      });
    }

    let questionsToUpdate: any = {};  // Default empty object

    if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
      // Regular exams (CT1, CT2, CA, ESE) → Update or Create Questions
      const existingQuestions = questions.filter((q: any) => q.id);
      const newQuestions = questions.filter((q: any) => !q.id);
      
      // Validate units
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
        deleteMany: {}, // Remove any existing questions if not part of the updated ones
        create: newQuestions.map((q: any) => ({
          questionText: q.text,
          marksAllocated: q.marksAllocated,
          unitId: q.unitId,
        })),
        update: existingQuestions.map((q: any) => ({
          where: { id: q.id },
          data: {
            questionText: q.text,
            marksAllocated: q.marksAllocated,
            unitId: q.unitId,
          }
        }))
      };
    } else if (INTERNAL_ASSESSMENT_TYPES.includes(examType)) {
      // Internal assessments (DHA, AA, ATT) → REMOVE QUESTIONS
      questionsToUpdate = {
        deleteMany: {} // Deletes all questions for internal assessments
      };
    }

    const updatedExam = await prisma.$transaction(async (tx) => {
      // Delete related marks if they exist
      if (EXAM_TYPES_WITH_QUESTIONS.includes(examType)) {
        // For standard exams, delete standardExamMarks and associated questionMarks
        // QuestionMarks will be automatically deleted due to onDelete: Cascade
        await tx.standardExamMarks.deleteMany({
          where: { examId: Number(id) }
        });
      } else {
        // For internal assessment exams, delete internalAssessmentMarks
        await tx.internalAssessmentMarks.deleteMany({
          where: { examId: Number(id) }
        });
      }

      return tx.exam.update({
        where: { id: Number(id) },
        data: {
          examType,
          subjectId,
          marksAllocated,
          questions: questionsToUpdate // Handles different logic for regular/internal
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
      message: "Exam updated successfully.",
      data: updatedExam
    });
  } catch (error) {
    console.error("Error in updateExam controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteExam = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const examId = Number(id);

    const existingExam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { 
        questions: true, 
        standardMarks: {
          include: {
            questionMarks: true
          }
        },
        internalMarks: true
      }
    });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Delete related marks based on exam type
      if (EXAM_TYPES_WITH_QUESTIONS.includes(existingExam.examType)) {
        // For standard exams with questions (CT1, CT2, CA, ESE)
        // QuestionMarks will be automatically deleted due to onDelete: Cascade
        if (existingExam.standardMarks.length > 0) {
          await tx.standardExamMarks.deleteMany({ where: { examId } });
        }
      } else {
        // For internal assessment exams (DHA, AA, ATT)
        if (existingExam.internalMarks.length > 0) {
          await tx.internalAssessmentMarks.deleteMany({ where: { examId } });
        }
      }

      // Delete related questions only for exams that use them (CT1, CT2, CA, ESE)
      if (existingExam.questions.length > 0) {
        await tx.question.deleteMany({ where: { examId } });
      }

      // Delete the exam itself
      await tx.exam.delete({ where: { id: examId } });
    });

    res.status(200).json({ success: true, message: "Exam deleted successfully." });
  } catch (error) {
    console.error("Error in deleteExam controller:", (error as Error).message);

    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error. Unable to delete exam." 
    });
  }
};