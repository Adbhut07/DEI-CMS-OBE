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

const bulkCreateUnitsSchema = zod.array(
  zod.object({
    unitNumber: zod.number().min(1, "Unit number must be greater than 0"),
    subjectId: zod.number().int().positive("Subject ID must be a positive integer"),
    description: zod.string().optional(),
  })
);

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
        courseMappings: {
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

    const existingUnit = await prisma.unit.findFirst({
      where: {
        unitNumber,
        subjectId,
      },
    });

    if (existingUnit) {
      return res.status(409).json({
        success: false,
        message: `Unit number ${unitNumber} already exists for this subject`,
      });
    }

    const unit = await prisma.unit.create({
      data: {
        unitNumber,
        subjectId,
        description,
      },
      include: {
        subject: {
          include: {
            courseMappings: {
              include: {
                course: true,
                faculty: true,
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
        courseMappings: {
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

    const existingUnit = await prisma.unit.findFirst({
      where: {
        unitNumber,
        subjectId,
        id: {
          not: Number(unitId)
        }
      },
    });

    if (existingUnit) {
      return res.status(409).json({
        success: false,
        message: `Unit number ${unitNumber} already exists for this subject`,
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
        subject: {
          include: {
            courseMappings: {
              include: {
                course: true,
                faculty: true,
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

export const getUnit = async (req: Request, res: Response): Promise<any> => {
  try {
    const { unitId } = req.params;

    const unit = await prisma.unit.findUnique({
      where: { id: Number(unitId) },
      include: {
        subject: {
          include: {
            courseMappings: {
              include: {
                course: true,
                faculty: true,
                batch: true,
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
        coAttainments: true,
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
        courseMappings: true,
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
            courseMappings: {
              include: {
                course: true,
                faculty: true,
                batch: true,
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
        coAttainments: true,
      },
      orderBy: {
        unitNumber: 'asc',
      },
    });

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

export const bulkCreateUnits = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = bulkCreateUnitsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const unitsToCreate = result.data;

    // Check for duplicate unit numbers within the same subject in the request
    const duplicatesInRequest = findDuplicatesInBulkCreate(unitsToCreate);
    if (duplicatesInRequest.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Duplicate unit numbers detected in request",
        duplicates: duplicatesInRequest,
      });
    }

    // Check against existing units in the database
    const existingConflicts: { subjectId: number; unitNumber: number }[] = [];
    
    for (const unit of unitsToCreate) {
      const existingUnit = await prisma.unit.findFirst({
        where: {
          unitNumber: unit.unitNumber,
          subjectId: unit.subjectId,
        },
      });

      if (existingUnit) {
        existingConflicts.push({
          subjectId: unit.subjectId,
          unitNumber: unit.unitNumber
        });
      }
    }

    if (existingConflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Some units already exist with the same unit number for the subject",
        conflicts: existingConflicts,
      });
    }

    const createdUnits = await prisma.unit.createMany({
      data: unitsToCreate,
    });

    return res.status(201).json({
      success: true,
      message: "Units created successfully",
      data: createdUnits,
    });
  } catch (error) {
    console.error("Error in bulkCreateUnits controller", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

function findDuplicatesInBulkCreate(units: { unitNumber: number; subjectId: number }[]) {
  const uniqueKeys = new Map<string, { unitNumber: number; subjectId: number }>();
  const duplicates: { unitNumber: number; subjectId: number }[] = [];

  for (const unit of units) {
    const key = `${unit.subjectId}-${unit.unitNumber}`;
    
    if (uniqueKeys.has(key)) {
      duplicates.push(unit);
    } else {
      uniqueKeys.set(key, unit);
    }
  }

  return duplicates;
}

export const getUnitsByCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params;
    const units = await prisma.unit.findMany({
      where: {
        subject: {
          courseMappings: {
            some: {
              courseId: Number(courseId),
            },
          },
        },
      },
      include: {
        subject: {
          include: {
            // courseMappings: {
            //   include: {
            //     course: true,
            //     faculty: true,
            //     batch: true,
            //   },
            // },
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: units });
  } catch (error) {
    console.error("Error in getUnitsByCourse controller", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const bulkDeleteUnits = async (req: Request, res: Response): Promise<any> => {
  try {
    const { unitIds } = req.body;

    if (!Array.isArray(unitIds) || unitIds.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid unit IDs" });
    }

    // Convert unitIds to numbers & filter out NaNs
    const validUnitIds = unitIds.map((id: any) => parseInt(id, 10)).filter((id: number) => !isNaN(id));

    if (validUnitIds.length === 0) {
      return res.status(400).json({ success: false, message: "No valid unit IDs provided" });
    }

    // Check if units exist before deleting
    const existingUnits = await prisma.unit.findMany({
      where: { id: { in: validUnitIds } }
    });

    if (existingUnits.length === 0) {
      return res.status(404).json({ success: false, message: "No valid units found to delete" });
    }

    // Delete units
    await prisma.unit.deleteMany({
      where: { id: { in: validUnitIds } }
    });

    return res.status(200).json({ success: true, message: "Units deleted successfully" });

  } catch (error) {
    console.error("Error in bulkDeleteUnits controller", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
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

    // Delete related records in a transaction to maintain data consistency
    await prisma.$transaction([
      // Delete CO-PO mappings
      prisma.cO_PO_Mapping.deleteMany({
        where: { coId: Number(unitId) }
      }),
      // Delete CO attainments
      prisma.cO_Attainment.deleteMany({
        where: { coId: Number(unitId) }
      }),
      // Delete questions
      prisma.question.deleteMany({
        where: { unitId: Number(unitId) }
      }),
      // Finally delete the unit
      prisma.unit.delete({
        where: { id: Number(unitId) }
      })
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

export const reorderUnits = async (req: Request, res: Response): Promise<any> => {
  try {
    const { unitOrders } = req.body;

    if (!Array.isArray(unitOrders) || unitOrders.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid unit order data" });
    }

    // Check for duplicate unit numbers after reordering
    const unitIds = unitOrders.map(order => order.unitId);
    
    // Get all units to be reordered
    const unitsToUpdate = await prisma.unit.findMany({
      where: { id: { in: unitIds } }
    });
    
    // Group units by subject ID to ensure we don't create duplicates within the same subject
    const unitsBySubject = new Map<number, Set<number>>();
    
    for (const unit of unitsToUpdate) {
      if (!unitsBySubject.has(unit.subjectId)) {
        unitsBySubject.set(unit.subjectId, new Set<number>());
      }
    }
    
    // Check for potential duplicates after reordering
    for (const order of unitOrders) {
      const unit = unitsToUpdate.find(u => u.id === order.unitId);
      if (!unit) continue;
      
      const subjectUnits = unitsBySubject.get(unit.subjectId)!;
      
      if (subjectUnits.has(order.newOrder)) {
        return res.status(409).json({
          success: false,
          message: "Reordering would create duplicate unit numbers within the same subject",
          conflict: {
            subjectId: unit.subjectId,
            unitNumber: order.newOrder
          }
        });
      }
      
      subjectUnits.add(order.newOrder);
    }

    const updatePromises = unitOrders.map(({ unitId, newOrder }) =>
      prisma.unit.update({
        where: { id: unitId },
        data: { unitNumber: newOrder },
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({ success: true, message: "Units reordered successfully" });
  } catch (error) {
    console.error("Error in reorderUnits controller", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};