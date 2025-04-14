import { Request, Response } from 'express';
import { PrismaClient, ExamType } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadMarks = async (req: Request, res: Response): Promise<any> => {
  const { 
    examId, 
    marks 
  }: { 
    examId: number, 
    marks: { 
      studentId: number, 
      questionMarks?: { questionId: number, marksObtained: number }[], 
      marksObtained?: number 
    }[] 
  } = req.body;

  const uploadedById = req.user?.id; 
  if (!uploadedById) {
    return res.status(401).json({ success: false, message: 'Unauthorized: User not found.' });
  }

  try {
    // Fetch exam details
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      select: { 
        id: true,
        subjectId: true, 
        examType: true, 
        questions: true 
      },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const INTERNAL_ASSESSMENTS: ExamType[] = [ExamType.DHA, ExamType.AA, ExamType.ATT];
    const isInternalAssessment = INTERNAL_ASSESSMENTS.includes(exam.examType);

    // Process marks for each student
    for (const studentMarks of marks) {
      if (isInternalAssessment) {
        // ✅ Internal Assessments (DHA, AA, ATT) → Store in InternalAssessmentMarks table
        if (studentMarks.marksObtained === undefined) {
          return res.status(400).json({
            success: false,
            message: `Total marks must be provided for ${exam.examType}.`
          });
        }

        // Upsert internal assessment marks
        await prisma.internalAssessmentMarks.upsert({
          where: {
            studentId_examId: {
              studentId: studentMarks.studentId,
              examId: examId
            }
          },
          update: { 
            marksObtained: studentMarks.marksObtained 
          },
          create: {
            studentId: studentMarks.studentId,
            examId: examId,
            subjectId: exam.subjectId,
            marksObtained: studentMarks.marksObtained,
            uploadedById: uploadedById
          }
        });

      } else {
        // ✅ Standard Exams (CT1, CT2, CA, ESE) → Store in StandardExamMarks with QuestionMark
        if (!studentMarks.questionMarks || studentMarks.questionMarks.length === 0) {
          return res.status(400).json({ 
            success: false, 
            message: `Question-wise marks are required for ${exam.examType}.` 
          });
        }

        // Calculate total marks
        const totalMarks = studentMarks.questionMarks.reduce(
          (sum, qm) => sum + qm.marksObtained, 0
        );

        // First, create or update the StandardExamMarks record
        const standardExamMark = await prisma.standardExamMarks.upsert({
          where: {
            studentId_examId: {
              studentId: studentMarks.studentId,
              examId: examId
            }
          },
          update: { 
            totalMarks: totalMarks,
            updatedAt: new Date()
          },
          create: {
            studentId: studentMarks.studentId,
            examId: examId,
            subjectId: exam.subjectId,
            totalMarks: totalMarks,
            uploadedById: uploadedById
          },
          select: {
            id: true
          }
        });

        // Then, create or update question-specific marks
        for (const markEntry of studentMarks.questionMarks) {
          await prisma.questionMark.upsert({
            where: {
              standardExamMarkId_questionId: {
                standardExamMarkId: standardExamMark.id,
                questionId: markEntry.questionId
              }
            },
            update: { 
              marksObtained: markEntry.marksObtained,
              updatedAt: new Date()
            },
            create: {
              standardExamMarkId: standardExamMark.id,
              questionId: markEntry.questionId,
              marksObtained: markEntry.marksObtained
            }
          });
        }
      }
    }

    res.status(201).json({ success: true, message: 'Marks uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading marks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const getStudentSubjectMarks = async (req: Request, res: Response): Promise<any> => {
  const { studentId, subjectId } = req.params;
  
  try {
    // Get standard exam marks (CT1, CT2, CA, ESE)
    const standardMarks = await prisma.standardExamMarks.findMany({
      where: {
        studentId: Number(studentId),
        subjectId: Number(subjectId)
      },
      include: {
        exam: true,
        questionMarks: {
          include: {
            question: true
          }
        }
      }
    });

    // Get internal assessment marks (DHA, AA, ATT)
    const internalMarks = await prisma.internalAssessmentMarks.findMany({
      where: {
        studentId: Number(studentId),
        subjectId: Number(subjectId)
      },
      include: {
        exam: true
      }
    });

    res.status(200).json({ 
      success: true, 
      data: {
        standardMarks,
        internalMarks
      }
    });
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Get marks for a specific exam
export const getExamMarks = async (req: Request, res: Response): Promise<any> => {
  const { examId } = req.params;
  
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      select: { examType: true }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const INTERNAL_ASSESSMENTS: ExamType[] = [ExamType.DHA, ExamType.AA, ExamType.ATT];
    const isInternalAssessment = INTERNAL_ASSESSMENTS.includes(exam.examType);

    let marksData;
    
    if (isInternalAssessment) {
      // Get internal assessment marks
      marksData = await prisma.internalAssessmentMarks.findMany({
        where: { examId: Number(examId) },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              enrollments: {
                select: {
                  rollNo: true
                }
              }
            }
          }
        }
      });
    } else {
      // Get standard exam marks with question breakdown
      marksData = await prisma.standardExamMarks.findMany({
        where: { examId: Number(examId) },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              enrollments: {
                select: {
                  rollNo: true
                }
              }
            }
          },
          questionMarks: {
            include: {
              question: true
            }
          }
        }
      });
    }

    res.status(200).json({ 
      success: true, 
      data: marksData,
      examType: exam.examType
    });
    
  } catch (error) {
    console.error('Error fetching exam marks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const getMarksByExam = async (req: Request, res: Response): Promise<any> => {
  const { examId } = req.params;
  
  try {
    // Get exam details first to determine how to handle the marks
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      select: { 
        id: true,
        examType: true, 
        subjectId: true,
        questions: {
          select: { 
            id: true, 
            questionText: true,
            marksAllocated: true
          }
        }
      }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const INTERNAL_ASSESSMENTS: ExamType[] = [ExamType.DHA, ExamType.AA, ExamType.ATT];
    const isInternalAssessment = INTERNAL_ASSESSMENTS.includes(exam.examType);

    // For internal assessments, we only need the total marks
    if (isInternalAssessment) {
      const internalMarks = await prisma.internalAssessmentMarks.findMany({
        where: { 
          examId: Number(examId)
        },
        select: {
          studentId: true,
          marksObtained: true,
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              enrollments: {
                select: {
                  rollNo: true,
                  batchId: true
                }
              }
            }
          }
        }
      });

      // Format student data
      const studentsData = internalMarks.map(mark => {
        const enrollment = mark.student.enrollments.find(e => e.rollNo) || mark.student.enrollments[0];
        return {
          id: mark.student.id,
          name: mark.student.name,
          email: mark.student.email,
          rollNo: enrollment?.rollNo || null,
          totalMarks: mark.marksObtained
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          examId: Number(examId),
          examType: exam.examType,
          isQuestionWise: false,
          students: studentsData
        }
      });
    } 
    // For regular exams, we need both question-wise and total marks
    else {
      // Get all standard exam marks with question breakdown
      const standardMarks = await prisma.standardExamMarks.findMany({
        where: { 
          examId: Number(examId)
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              enrollments: {
                select: {
                  rollNo: true,
                  batchId: true
                }
              }
            }
          },
          questionMarks: {
            include: {
              question: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      });

      // Format the student data
      const studentsData = standardMarks.map(mark => {
        const enrollment = mark.student.enrollments.find(e => e.rollNo) || mark.student.enrollments[0];
        
        // Create a map of question marks
        const questionMarksObj: Record<number, number> = {};
        mark.questionMarks.forEach(qm => {
          questionMarksObj[qm.questionId] = qm.marksObtained;
        });
        
        return {
          id: mark.student.id,
          name: mark.student.name,
          email: mark.student.email,
          rollNo: enrollment?.rollNo || null,
          questionMarks: questionMarksObj,
          totalMarks: mark.totalMarks
        };
      });

      // Format the response with questions info
      const responseData = {
        examId: Number(examId),
        examType: exam.examType,
        isQuestionWise: true,
        questions: exam.questions.map(q => ({ 
          id: q.id, 
          text: q.questionText,
          marksAllocated: q.marksAllocated
        })),
        students: studentsData
      };

      return res.status(200).json({ success: true, data: responseData });
    }
  } catch (error) {
    console.error('Error fetching marks:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};


export const deleteMarks = async (req: Request, res: Response): Promise<any> => {
  const { examId, studentId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: User not found.' });
  }

  try {
    // Get exam details to determine how to delete
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      select: { 
        examType: true,
        subjectId: true
      }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const INTERNAL_ASSESSMENTS: ExamType[] = [ExamType.DHA, ExamType.AA, ExamType.ATT];
    const isInternalAssessment = INTERNAL_ASSESSMENTS.includes(exam.examType);

    // Delete transactions will be different based on exam type
    if (isInternalAssessment) {
      // For internal assessments, delete the InternalAssessmentMarks entry
      await prisma.internalAssessmentMarks.delete({
        where: {
          studentId_examId: {
            examId: Number(examId),
            studentId: Number(studentId)
          }
        }
      });
    } else {
      // For standard exams, delete using a transaction
      await prisma.$transaction(async (tx) => {
        // First find the StandardExamMarks record to get its ID
        const standardExamMark = await tx.standardExamMarks.findUnique({
          where: {
            studentId_examId: {
              studentId: Number(studentId),
              examId: Number(examId)
            }
          },
          select: { id: true }
        });

        if (!standardExamMark) {
          throw new Error(`No marks found for student ${studentId} in exam ${examId}`);
        }

        // Delete all related QuestionMark records
        await tx.questionMark.deleteMany({
          where: {
            standardExamMarkId: standardExamMark.id
          }
        });

        // Delete the StandardExamMarks record
        await tx.standardExamMarks.delete({
          where: {
            id: standardExamMark.id
          }
        });
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Marks deleted successfully for student ID: ${studentId} in exam ID: ${examId}` 
    });
  } catch (error) {
    console.error('Error deleting marks:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const updateMarks = async (req: Request, res: Response): Promise<any> => {
  const { studentId, examId, questionId } = req.params;
  const { marksObtained } = req.body;
  
  try {
    // First check if this is a question-wise mark update or a total mark update
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      select: { 
        examType: true, 
        subjectId: true,
        questions: {
          select: { id: true, marksAllocated: true }
        }
      }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const INTERNAL_ASSESSMENTS: ExamType[] = [ExamType.DHA, ExamType.AA, ExamType.ATT];
    const isInternalAssessment = INTERNAL_ASSESSMENTS.includes(exam.examType);

    // For internal assessments, we're updating the total marks
    if (isInternalAssessment || questionId === 'total') {
      // Update the internal assessment marks
      const updatedMark = await prisma.internalAssessmentMarks.update({
        where: {
          studentId_examId: {
            studentId: Number(studentId),
            examId: Number(examId),
          },
        },
        data: { marksObtained: Number(marksObtained) },
        select: {
          studentId: true,
          examId: true,
          subjectId: true,
          marksObtained: true
        }
      });
      
      return res.status(200).json({ 
        success: true, 
        data: updatedMark,
        message: 'Total marks updated successfully.' 
      });
    } 
    // For standard exams with question-wise marks
    else {
      // First find the StandardExamMarks record
      const standardExamMark = await prisma.standardExamMarks.findUnique({
        where: {
          studentId_examId: {
            studentId: Number(studentId),
            examId: Number(examId)
          }
        },
        select: { id: true }
      });

      if (!standardExamMark) {
        return res.status(404).json({ 
          success: false, 
          message: 'Marks record not found.' 
        });
      }

      // Update the question-specific marks
      const updatedQuestionMark = await prisma.questionMark.update({
        where: {
          standardExamMarkId_questionId: {
            standardExamMarkId: standardExamMark.id,
            questionId: Number(questionId),
          },
        },
        data: { marksObtained: Number(marksObtained) },
        select: {
          questionId: true,
          marksObtained: true
        }
      });

      // Now get all question marks to recalculate the total
      const allQuestionMarks = await prisma.questionMark.findMany({
        where: {
          standardExamMarkId: standardExamMark.id
        },
        select: { marksObtained: true }
      });

      // Calculate total marks
      const totalMarksObtained = allQuestionMarks.reduce(
        (sum, qm) => sum + qm.marksObtained, 0
      );

      // Update the total marks in StandardExamMarks
      await prisma.standardExamMarks.update({
        where: {
          id: standardExamMark.id
        },
        data: { 
          totalMarks: totalMarksObtained,
          updatedAt: new Date()
        }
      });

      return res.status(200).json({ 
        success: true, 
        data: { 
          studentId: Number(studentId),
          examId: Number(examId),
          questionId: Number(questionId),
          marksObtained: updatedQuestionMark.marksObtained,
          totalMarksUpdated: totalMarksObtained 
        },
        message: 'Question marks and total marks updated successfully.' 
      });
    }
  } catch (error) {
    console.error('Error updating marks:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getMarksByBatch = async (req: Request, res: Response): Promise<any> => {
  const { batchId } = req.params;
  
  try {
    // Get all students in the batch with their enrollment details
    const studentsInBatch = await prisma.enrollment.findMany({
      where: { 
        batchId: Number(batchId),
        isActive: true 
      },
      select: { 
        studentId: true,
        rollNo: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
    });

    if (!studentsInBatch.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active students found in this batch.' 
      });
    }

    const studentIds = studentsInBatch.map(s => s.studentId);

    // Get course subjects for this batch to know which exams to include
    const batchCourseSubjects = await prisma.courseSubject.findMany({
      where: { batchId: Number(batchId) },
      select: { 
        subjectId: true,
        subject: {
          select: {
            id: true,
            subjectName: true,
            subjectCode: true,
            exams: {
              select: {
                id: true,
                examType: true
              }
            }
          }
        }
      }
    });

    // Extract the subject IDs
    const subjectIds = batchCourseSubjects.map(cs => cs.subjectId);

    // Get all standard exam marks
    const standardMarks = await prisma.standardExamMarks.findMany({
      where: { 
        studentId: { in: studentIds },
        subjectId: { in: subjectIds }
      },
      select: {
        studentId: true,
        subjectId: true,
        totalMarks: true,
        exam: {
          select: {
            examType: true
          }
        }
      }
    });

    // Get all internal assessment marks
    const internalMarks = await prisma.internalAssessmentMarks.findMany({
      where: { 
        studentId: { in: studentIds },
        subjectId: { in: subjectIds }
      },
      select: {
        studentId: true,
        subjectId: true,
        marksObtained: true,
        exam: {
          select: {
            examType: true
          }
        }
      }
    });

    // Define proper types for our objects
    interface SubjectMark {
      subjectId: number;
      subjectName: string;
      subjectCode: string;
      exams: Record<string, number>;
    }

    interface StudentData {
      studentId: number;
      name: string;
      email: string;
      rollNo: string | null;
      subjects: SubjectMark[];
    }

    // Map of SubjectId to SubjectInfo
    const subjectInfoMap = new Map<number, { name: string, code: string }>();
    batchCourseSubjects.forEach(cs => {
      subjectInfoMap.set(cs.subjectId, {
        name: cs.subject.subjectName,
        code: cs.subject.subjectCode
      });
    });

    // Organize data by student and subject
    const formattedData: StudentData[] = studentsInBatch.map(enrollment => {
      // Get all marks for this student
      const studentStandardMarks = standardMarks.filter(mark => mark.studentId === enrollment.studentId);
      const studentInternalMarks = internalMarks.filter(mark => mark.studentId === enrollment.studentId);
      
      // Group marks by subject
      const subjectMarksMap: Map<number, SubjectMark> = new Map();
      
      // Process standard marks
      studentStandardMarks.forEach(mark => {
        const subjectId = mark.subjectId;
        
        if (!subjectMarksMap.has(subjectId)) {
          const subjectInfo = subjectInfoMap.get(subjectId);
          if (!subjectInfo) return; // Skip if subject info not found
          
          subjectMarksMap.set(subjectId, {
            subjectId,
            subjectName: subjectInfo.name,
            subjectCode: subjectInfo.code,
            exams: {}
          });
        }
        
        const examType = mark.exam.examType;
        subjectMarksMap.get(subjectId)!.exams[examType] = mark.totalMarks;
      });
      
      // Process internal marks
      studentInternalMarks.forEach(mark => {
        const subjectId = mark.subjectId;
        
        if (!subjectMarksMap.has(subjectId)) {
          const subjectInfo = subjectInfoMap.get(subjectId);
          if (!subjectInfo) return; // Skip if subject info not found
          
          subjectMarksMap.set(subjectId, {
            subjectId,
            subjectName: subjectInfo.name,
            subjectCode: subjectInfo.code,
            exams: {}
          });
        }
        
        const examType = mark.exam.examType;
        subjectMarksMap.get(subjectId)!.exams[examType] = mark.marksObtained;
      });
      
      return {
        studentId: enrollment.studentId,
        name: enrollment.student.name,
        email: enrollment.student.email,
        rollNo: enrollment.rollNo,
        subjects: Array.from(subjectMarksMap.values())
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        batchId: Number(batchId),
        totalStudents: studentIds.length,
        students: formattedData
      }
    });
  } catch (error) {
    console.error("Error fetching batch marks:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};