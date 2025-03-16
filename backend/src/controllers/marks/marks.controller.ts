import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadMarks = async (req: Request, res: Response): Promise<any> => {
  const { examId, marks }: { examId: number, marks: { studentId: number, marks: { questionId: number, marksObtained: number }[] }[] } = req.body;
  const uploadedById = req.user?.id; 
  if (!uploadedById) {
    return res.status(401).json({ success: false, message: 'Unauthorized: User not found.' });
  }

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      include: { questions: true },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const questionIds = exam.questions.map((q) => q.id);
    for (const studentMarks of marks) {
      for (const markEntry of studentMarks.marks) {
        if (!questionIds.includes(markEntry.questionId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid questionId: ${markEntry.questionId} for examId: ${examId}`,
          });
        }

        const question = exam.questions.find(q => q.id === markEntry.questionId);
        if (question && markEntry.marksObtained > question.marksAllocated) {
          return res.status(400).json({
            success: false,
            message: `Marks obtained for questionId ${markEntry.questionId} exceeds allocated marks.`
          });
        }
      }
    }

    const markEntries = marks.flatMap((studentMarks) =>
      studentMarks.marks.map((markEntry) => ({
        studentId: studentMarks.studentId,
        questionId: markEntry.questionId,
        examId,
        marksObtained: markEntry.marksObtained,
        uploadedById,
      }))
    );

    await prisma.$transaction(
      markEntries.map((entry) =>
        prisma.marks.upsert({
          where: {
            studentId_questionId_examId: {
              studentId: entry.studentId,
              questionId: entry.questionId,
              examId: entry.examId,
            },
          },
          update: { marksObtained: entry.marksObtained },
          create: entry,
        })
      )
    );

    res.status(201).json({ success: true, message: 'Marks uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading marks:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMarksByExam = async (req: Request, res: Response): Promise<any> => {
  const { examId } = req.params;

  try {
    // Get all questions for the exam first
    const examQuestions = await prisma.question.findMany({
      where: { examId: Number(examId) },
      select: { id: true, questionText: true },
    });

    if (!examQuestions.length) {
      return res.status(404).json({ success: false, message: 'No questions found for the given exam.' });
    }

    // Get exam details to find subject and related info
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      select: { subjectId: true }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    // Get all marks for the exam with student info
    const marks = await prisma.marks.findMany({
      where: { examId: Number(examId) },
      select: {
        studentId: true,
        questionId: true,
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
          },
        },
      },
    });

    if (!marks.length) {
      return res.status(200).json({ 
        success: true, 
        data: {
          examId: Number(examId),
          questions: examQuestions.map(q => ({ id: q.id, text: q.questionText })),
          students: []
        } 
      });
    }

    // Group marks by student
    const studentsMap = new Map();
    
    marks.forEach(mark => {
      if (!studentsMap.has(mark.studentId)) {
        // Find the most relevant enrollment record (assuming a student might be in multiple batches)
        // For a more precise match, we would need to know which batch is associated with this exam
        const enrollment = mark.student.enrollments.find(e => e.rollNo) || mark.student.enrollments[0];
        
        studentsMap.set(mark.studentId, {
          id: mark.student.id,
          name: mark.student.name,
          email: mark.student.email,
          rollNo: enrollment?.rollNo || null,
          marks: {}
        });
      }
      
      // Add question marks to the student's marks object
      studentsMap.get(mark.studentId).marks[mark.questionId] = mark.marksObtained;
    });

    // Convert map to array
    const studentsData = Array.from(studentsMap.values());

    // Format the response with questions info
    const responseData = {
      examId: Number(examId),
      questions: examQuestions.map(q => ({ id: q.id, text: q.questionText })),
      students: studentsData
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateMarks = async (req: Request, res: Response): Promise<any> => {
  const { studentId, questionId, examId } = req.params;
  const { marksObtained } = req.body;

  try {
    const mark = await prisma.marks.update({
      where: {
        studentId_questionId_examId: {
          studentId: Number(studentId),
          questionId: Number(questionId),
          examId: Number(examId),
        },
      },
      data: { marksObtained },
      select: {
        studentId: true,
        questionId: true,
        examId: true,
        marksObtained: true
      }
    });

    res.status(200).json({ success: true, data: mark });
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteMarks = async (req: Request, res: Response): Promise<any> => {
  const { studentId, questionId, examId } = req.params;

  try {
    await prisma.marks.delete({
      where: {
        studentId_questionId_examId: {
          studentId: Number(studentId),
          questionId: Number(questionId),
          examId: Number(examId),
        },
      },
    });

    res.status(200).json({ success: true, message: 'Marks deleted successfully.' });
  } catch (error) {
    console.error('Error deleting marks:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMarksByBatch = async (req: Request, res: Response): Promise<any> => {
  const { batchId } = req.params;
  try {
    const studentsInBatch = await prisma.enrollment.findMany({
      where: { batchId: Number(batchId) },
      select: { studentId: true },
    });

    const studentIds = studentsInBatch.map((s) => s.studentId);

    const marks = await prisma.marks.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        student: { select: { id: true, name: true, email: true } },
        question: { select: { id: true, questionText: true } },
      },
    });

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    console.error("Error fetching batch marks:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
