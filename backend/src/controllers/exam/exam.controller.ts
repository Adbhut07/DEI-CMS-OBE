// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Get all exams with course information
// export const getExams = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const exams = await prisma.exam.findMany({
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
//     res.json(exams);
//   } catch (error) {
//     console.error("Error in getExams controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

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

// // Get a specific exam by ID with course information
// export const getExamById = async (req: Request, res: Response): Promise<any> => {
//   const { id } = req.params;
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: Number(id) },
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
//     if (exam) {
//       res.json(exam);
//     } else {
//       res.status(404).json({ success: false, message: "Exam not found" });
//     }
//   } catch (error) {
//     console.error("Error in getExamById controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // Create an exam with related questions
// export const createExam = async (req: Request, res: Response): Promise<any> => {
//   const { examType, subjectId, semesterId, questions } = req.body;
//   try {
//     const semester = await prisma.semester.findUnique({
//       where: { id: semesterId },
//     });

//     const subject = await prisma.subject.findUnique({
//       where: { id: subjectId },
//     });

//     if (!semester) {
//       return res.status(404).json({
//         success: false,
//         message: "Semester not found.",
//       });
//     }

//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found.",
//       });
//     }

//     for (const q of questions) {
//       const unit = await prisma.unit.findUnique({
//         where: { 
//           id: q.unitId,
//           subjectId: subjectId 
//         },
//       });

//       if (!unit) {
//         return res.status(400).json({
//           success: false,
//           message: `Unit with ID ${q.unitId} not found or does not belong to the specified subject.`,
//         });
//       }
//     }

//     const existingExam = await prisma.exam.findFirst({
//       where: {
//         examType,
//         subjectId,
//         semesterId,
//       },
//     });

//     if (existingExam) {
//       return res.status(400).json({
//         success: false,
//         message: "An exam with the same type already exists for this subject and semester.",
//       });
//     }

//     const newExam = await prisma.exam.create({
//       data: {
//         examType,
//         subjectId,
//         semesterId,
//         questions: {
//           create: questions.map((q: { text: string; marksAllocated: number; unitId: number }) => ({
//             questionText: q.text,
//             marksAllocated: q.marksAllocated,
//             unitId: q.unitId,
//           })),
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
    
//     res.status(201).json(newExam);
//   } catch (error) {
//     console.error("Error in createExam controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// //create controller function for getting all exams in a subject
// export const getExamsBySubject = async (req: Request, res: Response): Promise<any> => {
//   const { subjectId } = req.params;
//   try {
//     const exams = await prisma.exam.findMany({
//       where: {
//         subjectId: Number(subjectId),
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
//     res.json(exams);
//   } catch (error) {
//     console.error("Error in getExamsBySubject controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };  


// // Update an exam and related questions
// export const updateExam = async (req: Request, res: Response): Promise<any> => {
//   const { id } = req.params;
//   const { examType, subjectId, semesterId, questions } = req.body;

//   try {
//     const existingExam = await prisma.exam.findUnique({
//       where: { id: Number(id) },
//       include: { questions: true }
//     });

//     if (!existingExam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found"
//       });
//     }

//     const semester = await prisma.semester.findUnique({
//       where: { id: semesterId },
//     });

//     const subject = await prisma.subject.findUnique({
//       where: { id: subjectId },
//     });

//     if (!semester) {
//       return res.status(404).json({
//         success: false,
//         message: "Semester not found.",
//       });
//     }

//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found.",
//       });
//     }

//     for (const q of questions) {
//       if (!q.id) { // Only check unit for new questions
//         const unit = await prisma.unit.findUnique({
//           where: { 
//             id: q.unitId,
//             subjectId: subjectId 
//           },
//         });

//         if (!unit) {
//           return res.status(400).json({
//             success: false,
//             message: `Unit with ID ${q.unitId} not found or does not belong to the specified subject.`,
//           });
//         }
//       }
//     }

//     const duplicateExam = await prisma.exam.findFirst({
//       where: {
//         examType,
//         subjectId,
//         semesterId,
//         NOT: {
//           id: Number(id) // Exclude current exam from check
//         }
//       },
//     });

//     if (duplicateExam) {
//       return res.status(400).json({
//         success: false,
//         message: "An exam with the same type already exists for this subject and semester.",
//       });
//     }

//     // Separate existing and new questions
//     const existingQuestions = questions.filter((q: any) => q.id);
//     const newQuestions = questions.filter((q: any) => !q.id);

//     // Update the exam
//     const updatedExam = await prisma.exam.update({
//       where: { id: Number(id) },
//       data: {
//         examType,
//         subjectId,
//         semesterId,
//         questions: {
//           // Update existing questions
//           update: existingQuestions.map((q: any) => ({
//             where: { id: q.id },
//             data: {
//               questionText: q.text,
//               marksAllocated: q.marksAllocated,
//               unitId: q.unitId,
//             }
//           })),
//           // Add new questions
//           create: newQuestions.map((q: any) => ({
//             questionText: q.text,
//             marksAllocated: q.marksAllocated,
//             unitId: q.unitId,
//           }))
//         }
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

//     res.json({
//       success: true,
//       data: updatedExam
//     });
//   } catch (error) {
//     console.error("Error in updateExam controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// // Delete an exam and related questions
// export const deleteExam = async (req: Request, res: Response): Promise<any> => {
//   const { id } = req.params;

//   try {
//     const examId = Number(id);

//     // Delete related marks
//     await prisma.marks.deleteMany({
//       where: { examId },
//     });

//     // Delete related questions
//     await prisma.question.deleteMany({
//       where: { examId },
//     });

//     // Delete the exam
//     await prisma.exam.delete({
//       where: { id: examId },
//     });

//     res.status(200).json({ success: true, message: "Exam deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteExam controller:", (error as Error).message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
