import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as zod from 'zod';

const prisma = new PrismaClient();

// Define weightage values as enum
const WEIGHTAGE_VALUES = ['0', '0.5', '1', '1.5', '2', '2.5', '3'] as const;

// Define weightage levels for semantic meaning
const WEIGHTAGE_LEVELS = {
  NOT_MAPPED: '0',
  SLIGHT: '0.5',
  LOW: '1',
  MODERATE_LOW: '1.5',
  MODERATE: '2',
  MODERATE_HIGH: '2.5',
  HIGH: '3'
};

// Convert string weightage to number
function parseWeightage(weightage: string): number {
  return parseFloat(weightage);
}

// Schema for calculating PO attainment
const calculatePOAttainmentSchema = zod.object({
  courseId: zod.number().int().positive(),
  batchId: zod.number().int().positive()
});

export const calculatePOAttainment = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = calculatePOAttainmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: result.error.format()
      });
    }

    const { courseId, batchId } = result.data;

    // 1. Get all CO attainments for this batch
    const coAttainments = await prisma.cO_Attainment.findMany({
      where: {
        batchId,
        subject: {
          courseMappings: {
            some: {
              courseId,
              batchId
            }
          }
        }
      },
      include: {
        co: true,
        subject: true
      }
    });

    if (!coAttainments.length) {
      return res.status(404).json({
        success: false,
        message: "No CO attainments found for this course/batch"
      });
    }

    // 2. Get all CO-PO mappings for these COs
    const coIds = coAttainments.map(ca => ca.coId);
    const coPoMappings = await prisma.cO_PO_Mapping.findMany({
      where: {
        coId: { in: coIds },
        programOutcome: {
          courseId,
          batchId
        }
      },
      include: {
        programOutcome: true
      }
    });

    // 3. Get all POs for this course and batch
    const programOutcomes = await prisma.programOutcome.findMany({
      where: {
        courseId,
        batchId
      }
    });

    // 4. Create a map to store PO attainment calculations
    type POAttainmentData = {
      totalWeightedAttainment: number;
      totalWeightage: number;
      contributingCOs: Array<{
        coId: number;
        unitNumber: number;
        subjectName: string;
        attainment: number;
        weightage: number;
        contribution: number;
      }>;
    };

    const poAttainmentMap: Record<number, POAttainmentData> = {};

    // Initialize map for all POs
    programOutcomes.forEach(po => {
      poAttainmentMap[po.id] = {
        totalWeightedAttainment: 0,
        totalWeightage: 0,
        contributingCOs: []
      };
    });

    // 5. Calculate attainment contributions
    coPoMappings.forEach(mapping => {
      const coAttainment = coAttainments.find(ca => ca.coId === mapping.coId);
      if (!coAttainment) return;

      const { weightage } = mapping;
      
      if (weightage > 0) {
        const contribution = coAttainment.attainment * weightage;
        
        poAttainmentMap[mapping.poId].totalWeightedAttainment += contribution;
        poAttainmentMap[mapping.poId].totalWeightage += weightage;
        poAttainmentMap[mapping.poId].contributingCOs.push({
          coId: coAttainment.coId,
          unitNumber: coAttainment.co.unitNumber,
          subjectName: coAttainment.subject.subjectName,
          attainment: coAttainment.attainment,
          weightage,
          contribution
        });
      }
    });

    // 6. Calculate final attainment for each PO
    const poAttainments = await Promise.all(
      programOutcomes.map(async po => {
        const data = poAttainmentMap[po.id];
        const finalAttainment = data.totalWeightage > 0 
          ? data.totalWeightedAttainment / data.totalWeightage 
          : 0;
        
        // Round to nearest valid weightage value for consistency
        const roundedAttainment = Math.round(finalAttainment * 2) / 2;
        // Ensure it's within range
        const normalizedAttainment = Math.min(3, Math.max(0, roundedAttainment));
        
        // Update PO attainment in database
        const updatedAttainment = await prisma.pO_Attainment.upsert({
          where: {
            poId_batchId: {
              poId: po.id,
              batchId
            }
          },
          update: {
            attainment: normalizedAttainment
          },
          create: {
            poId: po.id,
            batchId,
            attainment: normalizedAttainment
          }
        });
        
        return {
          poId: po.id,
          description: po.description,
          attainment: normalizedAttainment,
          contributingCOs: data.contributingCOs,
          updatedAt: updatedAttainment.updatedAt
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "PO attainment calculated successfully",
      data: {
        courseId,
        batchId,
        poAttainments
      }
    });
  } catch (error) {
    console.error("Error in calculatePOAttainment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Schema for PO attainment matrix
const getPoAttainmentMatrixSchema = zod.object({
  courseId: zod.number().int().positive(),
  batchId: zod.number().int().positive()
});

export const getPOAttainmentMatrix = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    const batchId = parseInt(req.query.batchId as string);

    if (isNaN(courseId) || isNaN(batchId) || courseId <= 0 || batchId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID or batch ID"
      });
    }

    // 1. Get all units (COs) for subjects in this course/batch
    const courseSubjects = await prisma.courseSubject.findMany({
      where: {
        courseId,
        batchId
      },
      include: {
        subject: {
          include: {
            units: true
          }
        }
      }
    });

    // Collect all units
    const allUnits: Array<{
      id: number;
      unitNumber: number;
      description: string | null;
      subjectId: number;
      subjectName: string;
      subjectCode: string;
      attainment?: number;
    }> = [];

    courseSubjects.forEach(cs => {
      cs.subject.units.forEach(unit => {
        allUnits.push({
          id: unit.id,
          unitNumber: unit.unitNumber,
          description: unit.description,
          subjectId: cs.subject.id,
          subjectName: cs.subject.subjectName,
          subjectCode: cs.subject.subjectCode
        });
      });
    });

    // 2. Get all POs for this course/batch
    const programOutcomes = await prisma.programOutcome.findMany({
      where: {
        courseId,
        batchId
      },
      orderBy: {
        id: 'asc'
      }
    });

    // 3. Get all CO attainments
    const coAttainments = await prisma.cO_Attainment.findMany({
      where: {
        batchId,
        coId: { in: allUnits.map(unit => unit.id) }
      }
    });

    // Add attainment values to units
    allUnits.forEach(unit => {
      const attainment = coAttainments.find(ca => ca.coId === unit.id);
      if (attainment) {
        unit.attainment = attainment.attainment;
      }
    });

    // 4. Get all CO-PO mappings
    const coPoMappings = await prisma.cO_PO_Mapping.findMany({
      where: {
        coId: { in: allUnits.map(unit => unit.id) },
        poId: { in: programOutcomes.map(po => po.id) }
      }
    });

    // 5. Create the matrix
    const matrix = allUnits.map(unit => {
      const row: any = {
        coId: unit.id,
        unitNumber: unit.unitNumber,
        description: unit.description,
        subjectName: unit.subjectName,
        subjectCode: unit.subjectCode,
        attainment: unit.attainment || 0,
        mappings: {}
      };

      // Initialize mappings with all POs set to 0
      programOutcomes.forEach(po => {
        row.mappings[po.id] = {
          weightage: 0
        };
      });

      // Fill in existing mappings
      coPoMappings
        .filter(mapping => mapping.coId === unit.id)
        .forEach(mapping => {
          row.mappings[mapping.poId] = {
            weightage: mapping.weightage
          };
        });

      return row;
    });

    // 6. Get PO attainments
    const poAttainments = await prisma.pO_Attainment.findMany({
      where: {
        batchId,
        poId: { in: programOutcomes.map(po => po.id) }
      }
    });

    // Format PO data with attainment
    const formattedPOs = programOutcomes.map(po => {
      const attainment = poAttainments.find(a => a.poId === po.id);
      return {
        id: po.id,
        description: po.description,
        attainment: attainment?.attainment || 0
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        course: { id: courseId },
        batch: { id: batchId },
        programOutcomes: formattedPOs,
        matrix
      }
    });
  } catch (error) {
    console.error("Error in getPOAttainmentMatrix:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Schema for bulk updating CO-PO mappings with discrete weightage values
const updateMappingSchema = zod.object({
  coId: zod.number().int().positive(),
  poId: zod.number().int().positive(),
  weightage: zod.enum(WEIGHTAGE_VALUES).transform((val) => parseFloat(val))
});

const updateCOPOMappingsSchema = zod.object({
  updates: zod.array(updateMappingSchema)
});

export const updateCOPOMappings = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    const batchId = parseInt(req.query.batchId as string);
    
    if (isNaN(courseId) || courseId <= 0 || isNaN(batchId) || batchId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID or batch ID"
      });
    }

    const result = updateCOPOMappingsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format()
      });
    }

    // Verify all Units belong to subjects in this course
    const courseOutcomes = await prisma.unit.findMany({
      where: {
        subject: {
          courseMappings: {
            some: {
              courseId,
              batchId
            }
          }
        }
      },
      select: { id: true }
    });

    const validCoIds = new Set(courseOutcomes.map(co => co.id));
    const invalidCOs = result.data.updates.filter(update => !validCoIds.has(update.coId));

    if (invalidCOs.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some Course Outcomes do not belong to this course/batch",
        invalidCOs: invalidCOs.map(co => co.coId)
      });
    }

    // Verify all POs belong to this course and batch
    const programOutcomes = await prisma.programOutcome.findMany({
      where: {
        courseId,
        batchId
      },
      select: { id: true }
    });

    const validPoIds = new Set(programOutcomes.map(po => po.id));
    const invalidPOs = result.data.updates.filter(update => !validPoIds.has(update.poId));

    if (invalidPOs.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some Program Outcomes do not belong to this course/batch",
        invalidPOs: invalidPOs.map(po => po.poId)
      });
    }

    // Perform the updates
    const updateResults = await prisma.$transaction(
      result.data.updates.map(update => {
        // For weightage 0, delete the mapping if it exists
        if (update.weightage === 0) {
          return prisma.cO_PO_Mapping.deleteMany({
            where: {
              coId: update.coId,
              poId: update.poId
            }
          });
        }
        
        // For other weightages, upsert with the value
        return prisma.cO_PO_Mapping.upsert({
          where: {
            coId_poId: {
              coId: update.coId,
              poId: update.poId
            }
          },
          update: {
            weightage: update.weightage
          },
          create: {
            coId: update.coId,
            poId: update.poId,
            weightage: update.weightage
          }
        });
      })
    );

    return res.status(200).json({
      success: true,
      message: "CO-PO mappings updated successfully",
      data: result.data.updates
    });

  } catch (error) {
    console.error("Error in updateCOPOMappings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};