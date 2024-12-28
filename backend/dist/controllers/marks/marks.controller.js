"use strict";
// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// // Controller to handle marks upload
// export const uploadMarks = async (req: Request, res: Response) => {
//   const { examId, marks }: { examId: number, marks: { studentId: number, marks: { questionId: number, marksObtained: number }[] }[] } = req.body;
//   const uploadedById = req.user.id; // Assuming user authentication middleware adds `req.user`
//   try {
//     // Validate Exam
//     const exam = await prisma.exam.findUnique({
//       where: { id: Number(examId) },
//       include: { questions: true },
//     });
//     if (!exam) {
//       return res.status(404).json({ success: false, message: 'Exam not found.' });
//     }
//     // Validate Marks and Questions
//     const questionIds = exam.questions.map((q) => q.id);
//     for (const studentMarks of marks) {
//       for (const markEntry of studentMarks.marks) {
//         if (!questionIds.includes(markEntry.questionId)) {
//           return res.status(400).json({
//             success: false,
//             message: `Invalid questionId: ${markEntry.questionId} for examId: ${examId}`,
//           });
//         }
//         const question = exam.questions.find(q => q.id === markEntry.questionId);
//         if (question && markEntry.marksObtained > question.marksAllocated) {
//           return res.status(400).json({
//             success: false,
//             message: `Marks obtained for questionId ${markEntry.questionId} exceeds allocated marks.`
//           });
//         }
//       }
//     }
//     // Prepare Bulk Data
//     const markEntries = marks.flatMap((studentMarks) =>
//       studentMarks.marks.map((markEntry) => ({
//         studentId: studentMarks.studentId,
//         questionId: markEntry.questionId,
//         examId,
//         marksObtained: markEntry.marksObtained,
//         uploadedById,
//       }))
//     );
//     // Upsert Marks
//     await prisma.$transaction(
//       markEntries.map((entry) =>
//         prisma.marks.upsert({
//           where: {
//             studentId_questionId_examId: {
//               studentId: entry.studentId,
//               questionId: entry.questionId,
//               examId: entry.examId,
//             },
//           },
//           update: { marksObtained: entry.marksObtained },
//           create: entry,
//         })
//       )
//     );
//     res.status(201).json({ success: true, message: 'Marks uploaded successfully.' });
//   } catch (error) {
//     console.error('Error uploading marks:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
// // Controller to fetch marks for a specific exam
// export const getMarksByExam = async (req: Request, res: Response) => {
//   const { examId } = req.params;
//   try {
//     const marks = await prisma.marks.findMany({
//       where: { examId: Number(examId) },
//       include: {
//         student: {
//           select: { id: true, name: true, email: true },
//         },
//         question: {
//           select: { id: true, questionText: true },
//         },
//       },
//     });
//     if (!marks.length) {
//       return res.status(404).json({ success: false, message: 'No marks found for the given exam.' });
//     }
//     res.status(200).json({ success: true, data: marks });
//   } catch (error) {
//     console.error('Error fetching marks:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
// // Controller to update marks for a specific student and question
// export const updateMarks = async (req: Request, res: Response) => {
//   const { studentId, questionId, examId } = req.params;
//   const { marksObtained } = req.body;
//   try {
//     const mark = await prisma.marks.update({
//       where: {
//         studentId_questionId_examId: {
//           studentId: Number(studentId),
//           questionId: Number(questionId),
//           examId: Number(examId),
//         },
//       },
//       data: { marksObtained },
//     });
//     res.status(200).json({ success: true, data: mark });
//   } catch (error) {
//     console.error('Error updating marks:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
// // Controller to delete marks for a specific student and question
// export const deleteMarks = async (req: Request, res: Response) => {
//   const { studentId, questionId, examId } = req.params;
//   try {
//     await prisma.marks.delete({
//       where: {
//         studentId_questionId_examId: {
//           studentId: Number(studentId),
//           questionId: Number(questionId),
//           examId: Number(examId),
//         },
//       },
//     });
//     res.status(200).json({ success: true, message: 'Marks deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting marks:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
