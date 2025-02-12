import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";

const prisma = new PrismaClient();

const createUnitSchema = zod.object({
  unitNumber: zod.number().min(1, "Unit number must be greater than 0"),
  subjectId: zod.number().int().positive("Subject ID must be a positive integer"),
  description: zod.string().optional(),
});

const updateUnitSchema = zod.object({
  unitNumber: zod.number().min(1, "Unit number must be greater than 0"),
  subjectId: zod.number().int().positive("Subject ID must be a positive integer"),
  description: zod.string().optional(),
});

export const createUnit = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = createUnitSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { unitNumber, subjectId, description } = result.data;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        semester: {
          include: {
            course: true,
          },
        },
      },
    });
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    if (!subject.semester) {
      return res.status(400).json({
        success: false,
        message: "Subject is not associated with any semester",
      });
    }

    const unit = await prisma.unit.create({
      data: {
        unitNumber,
        subjectId,
        description,
      },
      include: {
        subject: true,
        coMappings: true,
        questions: true,
        coAttainments: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Unit created successfully",
      data: unit,
    });
  } catch (error) {
    console.error("Error in createUnit controller", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUnit = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = updateUnitSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { unitNumber, subjectId, description } = result.data;
    const { unitId } = req.params; 

    const unit = await prisma.unit.findUnique({
      where: { id: Number(unitId) },
    });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        semester: {
          include: {
            course: true,
          },
        },
      },
    });
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    if (!subject.semester) {
      return res.status(400).json({
        success: false,
        message: "The subject is not associated with a valid semester",
      });
    }

    const updatedUnit = await prisma.unit.update({
      where: { id: Number(unitId) },
      data: {
        unitNumber,
        subjectId,
        description,        
      },
      include: {
        subject: true,
        coMappings: true,
        questions: true,
        coAttainments: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: updatedUnit,
    });
  } catch (error) {
    console.error("Error in updateUnit controller", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteUnit = async (req: Request, res: Response): Promise<any> => {
    try {
      const { unitId } = req.params;
  
      const unit = await prisma.unit.findUnique({
        where: { id: Number(unitId) },
        include: {
          coMappings: true,
          questions: true,
          coAttainments: true,
        }
      });
  
      if (!unit) {
        return res.status(404).json({
          success: false,
          message: "Unit not found",
        });
      }
  
      // Delete related records first (if cascade delete is not set up)
      await prisma.$transaction([
        prisma.cO_PO_Mapping.deleteMany({ where: { coId: Number(unitId) } }),
        prisma.cO_Attainment.deleteMany({ where: { coId: Number(unitId) } }),
        prisma.question.deleteMany({ where: { unitId: Number(unitId) } }),
        prisma.unit.delete({ where: { id: Number(unitId) } }),
      ]);
  
      return res.status(200).json({
        success: true,
        message: "Unit and related records deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteUnit controller", (error as Error).message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

export const getUnit = async (req: Request, res: Response): Promise<any> => {
  try {
    const { unitId } = req.params; 

    const unit = await prisma.unit.findUnique({
        where: { id: Number(unitId) },
        include: {
          subject: {
            include: {
              semester: {
                include: {
                  course: true,
                },
              },
            },
          },
          coMappings: {
            include: {
              programOutcome: true,
            },
          },
          questions: {
            include: {
              exam: true,
            },
          },
        },
      });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    console.error("Error in getUnit controller", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllUnits = async (req: Request, res: Response): Promise<any> => {
    try {
      const { subjectId } = req.params; 
  
      if (isNaN(Number(subjectId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid subject ID",
        });
      }

      const subject = await prisma.subject.findUnique({
        where: { id: Number(subjectId) },
        include: {
          semester: true,
        },
      });
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }
  
      const units = await prisma.unit.findMany({
        where: {
          subjectId: Number(subjectId), 
        },
        include: {
            subject: {
              include: {
                semester: true,
              },
            },
            coMappings: {
              include: {
                programOutcome: true,
              },
            },
            questions: {
              include: {
                exam: true,
              },
            },
        },
        orderBy: {
          unitNumber: 'asc', 
        },
      });
  
      if (units.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No units found for this subject",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: units,
        message: units.length === 0 ? "No units found for this subject" : undefined,
      });
    } catch (error) {
      console.error("Error in getAllUnits controller", (error as Error).message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  