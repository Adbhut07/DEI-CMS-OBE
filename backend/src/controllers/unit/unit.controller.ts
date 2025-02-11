// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import zod from "zod";

// const prisma = new PrismaClient();

// const createUnitSchema = zod.object({
//   unitNumber: zod.number().min(1, "Unit number must be greater than 0"),
//   subjectId: zod.number().int().positive("Subject ID must be a positive integer"),
//   description: zod.string().optional(),
// });

// const updateUnitSchema = zod.object({
//   unitNumber: zod.number().min(1, "Unit number must be greater than 0"),
//   subjectId: zod.number().int().positive("Subject ID must be a positive integer"),
//   description: zod.string().optional(),
// });

// export const createUnit = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const result = createUnitSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid inputs",
//         errors: result.error.format(),
//       });
//     }

//     const { unitNumber, subjectId, description } = result.data;

//     const subject = await prisma.subject.findUnique({
//       where: { id: subjectId },
//       include: {
//         semester: {
//           include: {
//             course: true,
//           },
//         },
//       },
//     });
    
//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found",
//       });
//     }

//     if (!subject.semester) {
//       return res.status(400).json({
//         success: false,
//         message: "Subject is not associated with any semester",
//       });
//     }

//     const unit = await prisma.unit.create({
//       data: {
//         unitNumber,
//         subjectId,
//         description,
//       },
//       select: {
//         id: true,
//         unitNumber: true,
//         subjectId: true,
//         description: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Unit created successfully",
//       data: unit,
//     });
//   } catch (error) {
//     console.error("Error in createUnit controller", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// export const updateUnit = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const result = updateUnitSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid inputs",
//         errors: result.error.format(),
//       });
//     }

//     const { unitNumber, subjectId, description } = result.data;
//     const { unitId } = req.params; 

//     const unit = await prisma.unit.findUnique({
//       where: { id: Number(unitId) },
//     });

//     if (!unit) {
//       return res.status(404).json({
//         success: false,
//         message: "Unit not found",
//       });
//     }

//     const subject = await prisma.subject.findUnique({
//       where: { id: subjectId },
//       include: {
//         semester: {
//           include: {
//             course: true,
//           },
//         },
//       },
//     });
    
//     if (!subject) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found",
//       });
//     }

//     if (!subject.semester) {
//       return res.status(400).json({
//         success: false,
//         message: "The subject is not associated with a valid semester",
//       });
//     }

//     const updatedUnit = await prisma.unit.update({
//       where: { id: Number(unitId) },
//       data: {
//         unitNumber,
//         subjectId,
//         description,        
//       },
//       select: {
//         id: true,
//         unitNumber: true,
//         description: true,
//         subjectId: true,
//         updatedAt: true,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Unit updated successfully",
//       data: updatedUnit,
//     });
//   } catch (error) {
//     console.error("Error in updateUnit controller", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// export const deleteUnit = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { unitId } = req.params;

//     const unit = await prisma.unit.findUnique({
//       where: { id: Number(unitId) },
//     });

//     if (!unit) {
//       return res.status(404).json({
//         success: false,
//         message: "Unit not found",
//       });
//     }

//     await prisma.unit.delete({
//       where: { id: Number(unitId) },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Unit deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error in deleteUnit controller", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// export const getUnit = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { unitId } = req.params; 

//     const unit = await prisma.unit.findUnique({
//       where: { id: Number(unitId) },
//       include: {
//         subject: true, 
//       },
//     });

//     if (!unit) {
//       return res.status(404).json({
//         success: false,
//         message: "Unit not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: unit,
//     });
//   } catch (error) {
//     console.error("Error in getUnit controller", (error as Error).message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// export const getAllUnits = async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { subjectId } = req.params; 
  
//       if (isNaN(Number(subjectId))) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid subject ID",
//         });
//       }

//       const subject = await prisma.subject.findUnique({
//         where: { id: Number(subjectId) },
//         include: {
//           semester: true,
//         },
//       });
      
//       if (!subject) {
//         return res.status(404).json({
//           success: false,
//           message: "Subject not found",
//         });
//       }
  
//       const units = await prisma.unit.findMany({
//         where: {
//           subjectId: Number(subjectId), 
//         },
//         include: {
//           subject: true,
//         },
//         orderBy: {
//           unitNumber: 'asc', 
//         },
//       });
  
//       if (units.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No units found for this subject",
//         });
//       }
  
//       return res.status(200).json({
//         success: true,
//         data: units,
//       });
//     } catch (error) {
//       console.error("Error in getAllUnits controller", (error as Error).message);
//       return res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//       });
//     }
//   };
  