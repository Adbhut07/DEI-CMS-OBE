import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";

const prisma = new PrismaClient();

const createProgramOutcomeSchema = zod.object({
  courseId: zod.number().int().positive(),
  batchId: zod.number().int().positive(),
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

    // Verify that the batch belongs to the specified course
    const batch = await prisma.batch.findUnique({
      where: {
        id: result.data.batchId,
        courseId: result.data.courseId
      }
    });

    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID or batch does not belong to the specified course"
      });
    }

    const programOutcome = await prisma.programOutcome.create({
      data: result.data,
      include: {
        course: true,
        batch: true
      }
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

export const getAllProgramOutcomes = async (req: Request, res: Response): Promise<any> => {
  try {
    const programOutcomes = await prisma.programOutcome.findMany({
      include: {
        course: true,
        batch: true,
        poAttainments: true
      },
    });
    return res.status(200).json({ success: true, data: programOutcomes });
  } catch (error) {
    console.error("Error in getAllProgramOutcomes", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProgramOutcomesByCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    const batchId = parseInt(req.query.batchId as string);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    const whereClause: any = { courseId };
    if (!isNaN(batchId) && batchId > 0) {
      whereClause.batchId = batchId;
    }

    const programOutcomes = await prisma.programOutcome.findMany({
      where: whereClause,
      include: {
        course: true,
        batch: true,
        poAttainments: true
      },
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
    const batchId = parseInt(req.query.batchId as string);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    // Build the where clause for CourseSubject
    const whereClause: any = {
      courseId
    };
    if (!isNaN(batchId) && batchId > 0) {
      whereClause.batchId = batchId;
    }

    const units = await prisma.unit.findMany({
      where: {
        subject: {
          courseMappings: {
            some: whereClause
          }
        }
      },
      include: {
        subject: {
          include: {
            courseMappings: {
              where: whereClause,
              include: {
                batch: true
              }
            }
          }
        },
        coAttainments: {
          where: {
            batchId: !isNaN(batchId) ? batchId : undefined
          }
        }
      }
    });
    return res.status(200).json({ success: true, data: units });
  } catch (error) {
    console.error("Error in getCourseOutcomesByCourse", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// const createCOPOMappingSchema = zod.object({
//   coId: zod.number().int().positive(),
//   poId: zod.number().int().positive(),
//   weightage: zod.enum(['0', '0.5', '1', '1.5', '2', '2.5', '3']).transform(val => parseFloat(val)),
// });

// export const createCOPOMapping = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const courseId = parseInt(req.params.courseId);
//     const batchId = parseInt(req.query.batchId as string);

//     if (isNaN(courseId) || courseId <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid course ID"
//       });
//     }

//     const result = createCOPOMappingSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid input",
//         errors: result.error.format(),
//       });
//     }

//     // Verify the Unit belongs to a subject in this course
//     const courseOutcome = await prisma.unit.findFirst({
//       where: {
//         id: result.data.coId,
//         subject: {
//           courseMappings: {
//             some: {
//               courseId,
//               batchId: !isNaN(batchId) ? batchId : undefined
//             }
//           }
//         }
//       }
//     });

//     if (!courseOutcome) {
//       return res.status(404).json({
//         success: false,
//         message: "Course Outcome not found or doesn't belong to this course/batch"
//       });
//     }

//     // Verify the Program Outcome belongs to this course and batch
//     const whereClause: any = {
//       id: result.data.poId,
//       courseId
//     };
//     if (!isNaN(batchId)) {
//       whereClause.batchId = batchId;
//     }

//     const programOutcome = await prisma.programOutcome.findFirst({
//       where: whereClause
//     });

//     if (!programOutcome) {
//       return res.status(404).json({
//         success: false,
//         message: "Program Outcome not found or doesn't belong to this course/batch"
//       });
//     }

//     const mapping = await prisma.cO_PO_Mapping.create({
//       data: result.data,
//       include: {
//         courseOutcome: {
//           include: {
//             subject: true
//           }
//         },
//         programOutcome: {
//           include: {
//             batch: true
//           }
//         }
//       }
//     });

//     return res.status(201).json({
//       success: true,
//       message: "CO-PO Mapping created successfully",
//       data: mapping,
//     });
//   } catch (error) {
//     console.error("Error in createCOPOMapping", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getCOPOMappings = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const courseId = parseInt(req.params.courseId);
//     const batchId = parseInt(req.query.batchId as string);

//     if (isNaN(courseId) || courseId <= 0) {
//       return res.status(400).json({ success: false, message: "Invalid course ID" });
//     }

//     const whereClause: any = {
//       programOutcome: {
//         courseId
//       }
//     };
//     if (!isNaN(batchId)) {
//       whereClause.programOutcome.batchId = batchId;
//     }

//     const mappings = await prisma.cO_PO_Mapping.findMany({
//       where: whereClause,
//       select: {
//         weightage: true,
//         programOutcome: {
//           select: {
//             id: true,
//             description: true,
//             batch: {
//               select: {
//                 id: true,
//                 batchYear: true
//               }
//             }
//           }
//         },
//         courseOutcome: {
//           select: {
//             id: true,
//             unitNumber: true,
//             description: true,
//             subject: {
//               select: {
//                 id: true,
//                 subjectName: true,
//                 subjectCode: true
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!mappings.length) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "No CO-PO mappings found for this course/batch" 
//       });
//     }

//     const formattedMappings = mappings.map(mapping => ({
//       programOutcome: {
//         id: mapping.programOutcome.id,
//         description: mapping.programOutcome.description,
//         batch: mapping.programOutcome.batch
//       },
//       courseOutcome: {
//         id: mapping.courseOutcome.id,
//         unitNumber: mapping.courseOutcome.unitNumber,
//         description: mapping.courseOutcome.description,
//         subject: {
//           id: mapping.courseOutcome.subject.id,
//           name: mapping.courseOutcome.subject.subjectName,
//           code: mapping.courseOutcome.subject.subjectCode
//         }
//       },
//       weightage: mapping.weightage
//     }));

//     return res.status(200).json({ 
//       success: true, 
//       data: formattedMappings
//     });
//   } catch (error) {
//     console.error("Error in getCOPOMappings", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const updateMappingSchema = zod.object({
//   coId: zod.number().int().positive(),
//   poId: zod.number().int().positive(),
//   weightage: zod.enum(['0', '0.5', '1', '1.5', '2', '2.5', '3']).transform(val => parseFloat(val))
// });

// const updateCOPOMappingsSchema = zod.object({
//   updates: zod.array(updateMappingSchema)
// });

// export const updateCOPOMappings = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const courseId = parseInt(req.params.courseId);
//     const batchId = parseInt(req.query.batchId as string);
    
//     if (isNaN(courseId) || courseId <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid course ID"
//       });
//     }

//     const result = updateCOPOMappingsSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid input data",
//         errors: result.error.format()
//       });
//     }

//     // Verify all Units belong to subjects in this course
//     const courseOutcomes = await prisma.unit.findMany({
//       where: {
//         subject: {
//           courseMappings: {
//             some: {
//               courseId,
//               batchId: !isNaN(batchId) ? batchId : undefined
//             }
//           }
//         }
//       },
//       select: { id: true }
//     });

//     const validCoIds = new Set(courseOutcomes.map(co => co.id));
//     const invalidCOs = result.data.updates.filter(update => !validCoIds.has(update.coId));

//     if (invalidCOs.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Some Course Outcomes do not belong to this course/batch",
//         invalidCOs: invalidCOs.map(co => co.coId)
//       });
//     }

//     // Verify all POs belong to this course and batch
//     const whereClause: any = { courseId };
//     if (!isNaN(batchId)) {
//       whereClause.batchId = batchId;
//     }

//     const programOutcomes = await prisma.programOutcome.findMany({
//       where: whereClause,
//       select: { id: true }
//     });

//     const validPoIds = new Set(programOutcomes.map(po => po.id));
//     const invalidPOs = result.data.updates.filter(update => !validPoIds.has(update.poId));

//     if (invalidPOs.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Some Program Outcomes do not belong to this course/batch",
//         invalidPOs: invalidPOs.map(po => po.poId)
//       });
//     }

//     const updateResults = await prisma.$transaction(
//       result.data.updates.map(update => 
//         prisma.cO_PO_Mapping.upsert({
//           where: {
//             coId_poId: {
//               coId: update.coId,
//               poId: update.poId
//             }
//           },
//           update: {
//             weightage: update.weightage
//           },
//           create: {
//             coId: update.coId,
//             poId: update.poId,
//             weightage: update.weightage
//           }
//         })
//       )
//     );

//     return res.status(200).json({
//       success: true,
//       message: "CO-PO mappings updated successfully",
//       data: updateResults
//     });

//   } catch (error) {
//     console.error("Error in updateCOPOMappings:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error"
//     });
//   }
// };



const createCOPOMappingSchema = zod.object({
  coId: zod.number().int().positive(),
  poId: zod.number().int().positive(),
  weightage: zod.enum(['0', '0.5', '1', '1.5', '2', '2.5', '3']).transform(val => parseFloat(val)),
});

// New schema for bulk creation
const createBulkCOPOMappingSchema = zod.object({
  mappings: zod.array(createCOPOMappingSchema)
});

const copoMappingSchema = zod.object({
  coId: zod.number().int().positive(),
  poId: zod.number().int().positive(),
  weightage: zod.enum(['0', '0.5', '1', '1.5', '2', '2.5', '3']).transform(val => parseFloat(val)),
});

// Schema for bulk operations
const bulkCOPOMappingSchema = zod.object({
  mappings: zod.array(copoMappingSchema)
});

export const createCOPOMapping = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    const batchId = parseInt(req.query.batchId as string);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    // Check if the request is for bulk operation or single mapping
    const isBulkRequest = Array.isArray(req.body.mappings);
    
    // Validate input
    let mappingsToProcess: any[] = [];
    
    if (isBulkRequest) {
      const result = bulkCOPOMappingSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid input",
          errors: result.error.format(),
        });
      }
      mappingsToProcess = result.data.mappings;
    } else {
      const result = copoMappingSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid input",
          errors: result.error.format(),
        });
      }
      mappingsToProcess = [result.data];
    }

    // Check for duplicate entries in the request
    const requestPairs = new Set();
    const duplicateEntries = mappingsToProcess.filter(mapping => {
      const pair = `${mapping.coId}-${mapping.poId}`;
      if (requestPairs.has(pair)) {
        return true;
      }
      requestPairs.add(pair);
      return false;
    });

    if (duplicateEntries.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Request contains duplicate CO-PO pairs",
        duplicates: duplicateEntries
      });
    }

    // Extract all unique coIds and poIds for batch validation
    const coIds = [...new Set(mappingsToProcess.map(mapping => mapping.coId))];
    const poIds = [...new Set(mappingsToProcess.map(mapping => mapping.poId))];

    // Verify all Course Outcomes belong to subjects in this course
    const courseOutcomes = await prisma.unit.findMany({
      where: {
        id: { in: coIds },
        subject: {
          courseMappings: {
            some: {
              courseId,
              batchId: !isNaN(batchId) ? batchId : undefined
            }
          }
        }
      },
      select: { id: true }
    });

    const validCoIds = new Set(courseOutcomes.map(co => co.id));
    const invalidCOs = mappingsToProcess.filter(mapping => !validCoIds.has(mapping.coId));

    if (invalidCOs.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Some Course Outcomes not found or don't belong to this course/batch",
        invalidCOs: invalidCOs.map(mapping => mapping.coId)
      });
    }

    // Verify all Program Outcomes belong to this course and batch
    const whereClause: any = { 
      id: { in: poIds },
      courseId 
    };
    
    if (!isNaN(batchId)) {
      whereClause.batchId = batchId;
    }

    const programOutcomes = await prisma.programOutcome.findMany({
      where: whereClause,
      select: { id: true }
    });

    const validPoIds = new Set(programOutcomes.map(po => po.id));
    const invalidPOs = mappingsToProcess.filter(mapping => !validPoIds.has(mapping.poId));

    if (invalidPOs.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Some Program Outcomes not found or don't belong to this course/batch",
        invalidPOs: invalidPOs.map(mapping => mapping.poId)
      });
    }

    // Check for existing mappings to classify as updates vs creations
    const existingMappings = await prisma.cO_PO_Mapping.findMany({
      where: {
        OR: mappingsToProcess.map(mapping => ({
          coId: mapping.coId,
          poId: mapping.poId
        }))
      },
      select: {
        id: true,
        coId: true,
        poId: true
      }
    });

    const existingPairsMap = new Map(
      existingMappings.map(mapping => [`${mapping.coId}-${mapping.poId}`, mapping.id])
    );
    
    // Track operations for response
    let createdCount = 0;
    let updatedCount = 0;

    // Use upsert for each mapping in a transaction
    const results = await prisma.$transaction(
      mappingsToProcess.map(mapping => {
        const pairKey = `${mapping.coId}-${mapping.poId}`;
        const exists = existingPairsMap.has(pairKey);
        
        // Count the operation type
        if (exists) {
          updatedCount++;
        } else {
          createdCount++;
        }
        
        return prisma.cO_PO_Mapping.upsert({
          where: {
            coId_poId: {
              coId: mapping.coId,
              poId: mapping.poId
            }
          },
          update: {
            weightage: mapping.weightage
          },
          create: {
            coId: mapping.coId,
            poId: mapping.poId,
            weightage: mapping.weightage
          },
          include: {
            courseOutcome: {
              include: {
                subject: true
              }
            },
            programOutcome: {
              include: {
                batch: true
              }
            }
          }
        });
      })
    );

    return res.status(200).json({
      success: true,
      message: `CO-PO Mappings processed successfully: ${createdCount} created, ${updatedCount} updated`,
      data: results
    });
  } catch (error) {
    console.error("Error in createOrUpdateCOPOMapping", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCOPOMappings = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    const batchId = parseInt(req.query.batchId as string);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    const whereClause: any = {
      programOutcome: {
        courseId
      }
    };
    if (!isNaN(batchId)) {
      whereClause.programOutcome.batchId = batchId;
    }

    const mappings = await prisma.cO_PO_Mapping.findMany({
      where: whereClause,
      select: {
        weightage: true,
        programOutcome: {
          select: {
            id: true,
            description: true,
            batch: {
              select: {
                id: true,
                batchYear: true
              }
            }
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
        message: "No CO-PO mappings found for this course/batch" 
      });
    }

    const formattedMappings = mappings.map(mapping => ({
      programOutcome: {
        id: mapping.programOutcome.id,
        description: mapping.programOutcome.description,
        batch: mapping.programOutcome.batch
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