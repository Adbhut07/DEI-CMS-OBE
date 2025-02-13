import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";

const prisma = new PrismaClient();

const createProgramOutcomeSchema = zod.object({
  courseId: zod.number().int().positive(),
  description: zod.string().min(5),
});

export const createProgramOutcome = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = createProgramOutcomeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const programOutcome = await prisma.programOutcome.create({
      data: result.data,
    });

    return res.status(201).json({
      success: true,
      message: "Program Outcome created successfully",
      data: programOutcome,
    });
  } catch (error) {
    console.error("Error in createProgramOutcome", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllProgramOutcomes = async (req: Request, res: Response): Promise<any>=> {
  try {
    const programOutcomes = await prisma.programOutcome.findMany({
      include: {
        course: true,
      },
    });
    return res.status(200).json({ success: true, data: programOutcomes });
  } catch (error) {
    console.error("Error in getAllProgramOutcomes", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProgramOutcomesByCourse = async (req: Request, res: Response): Promise<any>=> {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    const programOutcomes = await prisma.programOutcome.findMany({
      where: { courseId },
      include: { course: true },
    });
    return res.status(200).json({ success: true, data: programOutcomes });
  } catch (error) {
    console.error("Error in getProgramOutcomesByCourse", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCourseOutcomesByCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    const courseOutcomes = await prisma.unit.findMany({
      where: {
        subject: {
          semester: {
            courseId: courseId
          }
        }
      },
      include: {
        subject: {
          include: {
            semester: true
          }
        }
      }
    });
    return res.status(200).json({ success: true, data: courseOutcomes });
  } catch (error) {
    console.error("Error in getCourseOutcomesByCourse", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createCOPOMappingSchema = zod.object({
  coId: zod.number().int().positive(), // Maps to Unit (Course Outcome)
  poId: zod.number().int().positive(), // Maps to ProgramOutcome
  weightage: zod.number().min(0).max(1),
});

export const createCOPOMapping = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    const result = createCOPOMappingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: result.error.format(),
      });
    }

    const courseOutcome = await prisma.unit.findFirst({
      where: {
        id: result.data.coId,
        subject: {
          semester: {
            courseId: courseId
          }
        }
      }
    });

    if (!courseOutcome) {
      return res.status(404).json({
        success: false,
        message: "Course Outcome not found or doesn't belong to this course"
      });
    }

    const programOutcome = await prisma.programOutcome.findFirst({
      where: {
        id: result.data.poId,
        courseId: courseId
      }
    });

    if (!programOutcome) {
      return res.status(404).json({
        success: false,
        message: "Program Outcome not found or doesn't belong to this course"
      });
    }

    const existingMapping = await prisma.cO_PO_Mapping.findFirst({
      where: {
        coId: result.data.coId,
        poId: result.data.poId
      }
    });

    if (existingMapping) {
      return res.status(409).json({
        success: false,
        message: "Mapping already exists between this CO and PO"
      });
    }

    const mapping = await prisma.cO_PO_Mapping.create({
      data: result.data,
      include: {
        courseOutcome: {
          include: {
            subject: true
          }
        },
        programOutcome: true
      }
    });

    return res.status(201).json({
      success: true,
      message: "CO-PO Mapping created successfully",
      data: mapping,
    });
  } catch (error) {
    console.error("Error in createCOPOMapping", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCOPOMappings = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    const mappings = await prisma.cO_PO_Mapping.findMany({
      where: {
        programOutcome: {
          courseId: courseId
        }
      },
      select: {
        weightage: true,
        programOutcome: {
          select: {
            id: true,
            description: true
          }
        },
        courseOutcome: {
          select: {
            id: true,
            unitNumber: true,
            description: true,
            subject: {
              select: {
                id: true,
                subjectName: true,
                subjectCode: true
              }
            }
          }
        }
      }
    });

    if (!mappings.length) {
      return res.status(404).json({ 
        success: false, 
        message: "No CO-PO mappings found for this course" 
      });
    }

    // Transform the data for a cleaner response
    const formattedMappings = mappings.map(mapping => ({
      programOutcome: {
        id: mapping.programOutcome.id,
        description: mapping.programOutcome.description
      },
      courseOutcome: {
        id: mapping.courseOutcome.id,
        unitNumber: mapping.courseOutcome.unitNumber,
        description: mapping.courseOutcome.description,
        subject: {
          id: mapping.courseOutcome.subject.id,
          name: mapping.courseOutcome.subject.subjectName,
          code: mapping.courseOutcome.subject.subjectCode
        }
      },
      weightage: mapping.weightage
    }));

    return res.status(200).json({ 
      success: true, 
      data: formattedMappings
    });
  } catch (error) {
    console.error("Error in getCOPOMappings", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Validation schema for single mapping update
const updateMappingSchema = zod.object({
  coId: zod.number().int().positive(),
  poId: zod.number().int().positive(),
  weightage: zod.number().min(0).max(1)
});

// Validation schema for bulk update request
const updateCOPOMappingsSchema = zod.object({
  updates: zod.array(updateMappingSchema)
});

export const updateCOPOMappings = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params;
    
    // Validate courseId
    const parsedCourseId = parseInt(courseId);
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    // Validate request body
    const result = updateCOPOMappingsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format()
      });
    }

    // Verify all COs belong to the specified course
    const courseOutcomes = await prisma.unit.findMany({
      where: {
        subject: {
          semester: {
            courseId: parsedCourseId
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
        message: "Some Course Outcomes do not belong to this course",
        invalidCOs: invalidCOs.map(co => co.coId)
      });
    }

    // Verify all POs belong to the specified course
    const programOutcomes = await prisma.programOutcome.findMany({
      where: { courseId: parsedCourseId },
      select: { id: true }
    });

    const validPoIds = new Set(programOutcomes.map(po => po.id));
    const invalidPOs = result.data.updates.filter(update => !validPoIds.has(update.poId));

    if (invalidPOs.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some Program Outcomes do not belong to this course",
        invalidPOs: invalidPOs.map(po => po.poId)
      });
    }

    // Perform updates in a transaction
    const updateResults = await prisma.$transaction(
      result.data.updates.map(update => 
        prisma.cO_PO_Mapping.upsert({
          where: {
            coId_poId: {  // This will now work with the compound unique constraint
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
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: "CO-PO mappings updated successfully",
      data: updateResults
    });

  } catch (error) {
    console.error("Error in updateCOPOMappings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};