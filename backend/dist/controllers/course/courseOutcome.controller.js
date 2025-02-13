"use strict";
// Course outcome is UNIT 
// so no need to create a separate controller for course outcome
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import zod from "zod";
// const prisma = new PrismaClient();
// const courseOutcomeSchema = zod.object({
//   description: zod.string().min(5, "Description must be at least 5 characters"),
//   unitId: zod.number().int().positive("Unit ID must be a positive integer"),
//   subjectId: zod.number().int().positive("Subject ID must be a positive integer"),
// });
// export const createCourseOutcome = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const result = courseOutcomeSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid inputs",
//         errors: result.error.format(),
//       });
//     }
//     const { description, unitId, subjectId } = req.body;
//     const courseOutcome = await prisma.courseOutcome.create({
//       data: {
//         description,
//         unitId: parseInt(unitId),
//         subjectId: subjectId ? parseInt(subjectId) : null, // Ensure optional field is handled
//         attainment: 0, // Default attainment
//       },
//     });
//     return res.status(201).json({
//       success: true,
//       data: courseOutcome,
//     });
//   } catch (error) {
//     console.error("Error in createCourseOutcome controller:", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
// export const getCourseOutcomesBySubject = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { subjectId, semesterId } = req.params;
//     if (isNaN(Number(subjectId))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Subject ID",
//       });
//     }
//     const whereClause: any = { subjectId: Number(subjectId) };
//     if (semesterId && !isNaN(Number(semesterId))) {
//       whereClause.semesterId = Number(semesterId);
//     }
//     const courseOutcomes = await prisma.courseOutcome.findMany({
//       where: whereClause,
//       include: {
//         unit: true,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });
//     return res.status(200).json({
//       success: true,
//       data: courseOutcomes,
//     });
//   } catch (error) {
//     console.error("Error in getCourseOutcomesBySubject controller:", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
// export const getCourseOutcome = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { id } = req.params;
//     if (isNaN(Number(id))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Course Outcome ID",
//       });
//     }
//     const courseOutcome = await prisma.courseOutcome.findUnique({
//       where: { id: Number(id) },
//       include: {
//         unit: true,
//         Subject: true,
//       },
//     });
//     if (!courseOutcome) {
//       return res.status(404).json({
//         success: false,
//         message: "Course Outcome not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       data: courseOutcome,
//     });
//   } catch (error) {
//     console.error("Error in getCourseOutcome controller:", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
// export const updateCourseOutcome = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { id } = req.params;
//     if (isNaN(Number(id))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Course Outcome ID",
//       });
//     }
//     const result = courseOutcomeSchema.partial().safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid inputs",
//         errors: result.error.format(),
//       });
//     }
//     const updatedCourseOutcome = await prisma.courseOutcome.update({
//       where: { id: Number(id) },
//       data: result.data,
//     });
//     return res.status(200).json({
//       success: true,
//       data: updatedCourseOutcome,
//     });
//   } catch (error) {
//     console.error("Error in updateCourseOutcome controller:", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
// export const deleteCourseOutcome = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { id } = req.params;
//     if (isNaN(Number(id))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Course Outcome ID",
//       });
//     }
//     await prisma.courseOutcome.delete({
//       where: { id: Number(id) },
//     });
//     return res.status(200).json({
//       success: true,
//       message: "Course Outcome deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error in deleteCourseOutcome controller:", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
//
